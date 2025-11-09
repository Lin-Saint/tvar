// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// Allow using global `fetch` in environments where TypeScript DOM lib isn't present.
declare const fetch: any;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Diagnostic output
	console.log('Congratulations, your extension "tvar" is now active!');

	// Hello world command
	const hello = vscode.commands.registerCommand("tvar.helloWorld", () => {
		vscode.window.showInformationMessage("Hello World from Tvar!");
	});

	// Translate selected text command
	const translateCmd = vscode.commands.registerCommand(
		"tvar.translateVariable",
		async () => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showWarningMessage("No active editor found!");
				return;
			}
			const selection = editor.selection;
			const text = editor.document.getText(selection).trim();
			if (!text) {
				vscode.window.showInformationMessage(
					"No text selected. Please select Chinese text to translate."
				);
				return;
			}

			// Read config and env
			const config = vscode.workspace.getConfiguration("tvar");
			const configuredKey = config.get<string>("deepseekApiKey") || "";
			const provider = config.get<string>("translationProvider") || "deepseek";
			const envKey = process.env.DEEPSEEK_API_KEY || "";
			const apiKey =
				configuredKey || envKey || "sk-97bcc80de7474813bae12052e88711f1"; // 默认使用提供的key

			let translated = "";
			try {
				if (provider === "deepseek") {
					translated = await translateWithDeepSeek(apiKey, text);
				} else {
					translated = mockTranslate(text);
				}

				if (!translated) {
					vscode.window.showErrorMessage("Translation returned empty result.");
					return;
				}

				await editor.edit((editBuilder) => {
					editBuilder.replace(selection, translated);
				});

				vscode.window.showInformationMessage("Selected text translated.");
			} catch (err: any) {
				console.error("Translation error:", err);
				vscode.window.showErrorMessage(
					`Translation failed: ${err?.message || err}`
				);
			}
		}
	);

	context.subscriptions.push(hello, translateCmd);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function mockTranslate(text: string): string {
	// Very small heuristic: if contains Chinese characters, return a placeholder translation.
	const hasChinese = /[\u4e00-\u9fff]/.test(text);
	if (!hasChinese) {
		return text;
	}
	return `${text} — translated to English (mock)`;
}

async function translateWithDeepSeek(
	apiKey: string,
	text: string
): Promise<string> {
	const endpoint = "https://api.deepseek.com/v1/chat/completions";
	const body = {
		model: "deepseek-chat",
		messages: [
			{
				role: "system",
				content:
					"You are a translator. When given Chinese text, translate it to English. Return only the English translation, no explanations.",
			},
			{ role: "user", content: text },
		],
		temperature: 0.2,
		max_tokens: 1000,
		stop: ["\n", "。", ".", "!", "?"],
	};

	const res = await fetch(endpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify(body),
	});

	if (!res.ok) {
		const errText = await res.text();
		throw new Error(`DeepSeek request failed: ${res.status} ${errText}`);
	}

	const data = await res.json();
	const content = data?.choices?.[0]?.message?.content ?? "";
	return (content || "").trim();
}
