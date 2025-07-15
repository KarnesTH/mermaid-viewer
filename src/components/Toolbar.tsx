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

	/**
	 * Handles the download of the code
	 * 
	 * @returns void
	 */
	const handleDownload = () => {
		const blob = new Blob([code], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'mermaid-code.mmd';
		a.click();
	}

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
					<input type="file" name="file" id="file-download" accept=".mmd,.mermaid" onChange={() => {}} className="hidden" />
					<label
						htmlFor="file-download"
						title="Download Mermaid-Code"
						className="p-2 flex items-center justify-center rounded-xl border-2 border-primary hover:bg-primary hover:border-tertiary text-text hover:text-bg transition-colors duration-300 cursor-pointer"
						onClick={handleDownload}
					>
						<i className="ri-download-2-line text-xl"></i>
					</label>
				</div>
			</div>
		</div>
	);
}

export default Toolbar;