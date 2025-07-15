import { useEffect, useState } from "react";

interface ToolbarProps {
	code: string;
	setCode: (code: string) => void;
}

/**
 * Toolbar component
 * 
 * @param code - The code to display in the toolbar
 * @param setCode - The function to set the code in the toolbar
 * @returns The Toolbar component
 */
const Toolbar = ({ code, setCode }: ToolbarProps) => {
	const [downloadUrl, setDownloadUrl] = useState<string>("");

	/**
	 * Handles the file change event
	 * 
	 * @param e - The file change event
	 * @returns void
	 */
	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const text = await file.text();
		setCode(text);
	}

	useEffect(() => {
		if (!code) {
			setDownloadUrl("");
			return;
		}
		const blob = new Blob([code], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		setDownloadUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [code]);

	return (
		<div className="absolute top-10 right-10">
			<div className="flex justify-between items-center gap-4">
				<div className="flex items-center gap-2">
					<input type="file" name="file" id="file-upload" accept=".mmd,.mermaid" onChange={handleFileChange} className="hidden" />
					<label
						htmlFor="file-upload"
						title="Upload Mermaid-Code"
						className="p-2 flex items-center justify-center rounded-xl border-2 border-primary hover:bg-primary hover:border-tertiary text-text hover:text-bg transition-colors duration-300 cursor-pointer"
					>
						<i className="ri-upload-2-line text-xl"></i>
					</label>
				</div>
				<div className="flex items-center gap-2">
					<a
						href={downloadUrl}
						download="mermaid-code.mmd"
						title="Download Mermaid-Code"
						className="p-2 flex items-center justify-center rounded-xl border-2 border-primary hover:bg-primary hover:border-tertiary text-text hover:text-bg transition-colors duration-300 cursor-pointer"
						style={{ pointerEvents: downloadUrl ? "auto" : "none", opacity: downloadUrl ? 1 : 0.5 }}
					>
						<i className="ri-download-2-line text-xl"></i>
					</a>
				</div>
			</div>
		</div>
	);
}

export default Toolbar;