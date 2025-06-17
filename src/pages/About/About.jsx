export default function About() {
  return (
    <div className=" flex items-center  px-2">
      <div className="w-full bg-transparent rounded-2xl p-6 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-bold italic text-white mb-6 pb-2">
          Welcome to the Brain <span className="text-cyan-400">Tumor</span>{" "}
          Classification Platform
        </h2>
        <div className="mb-6">
          <h3 className="text-xl font-bold italic text-cyan-400 mb-1">
            Our Mission
          </h3>
          <p className="text-white text-lg font-bold mb-2">
            To make brain <span className="text-cyan-400">tumor</span> detection
            faster, more accessible, and more accurate using the power of
            artificial intelligence and medical imaging.
          </p>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-bold italic text-cyan-400 mb-1">
            Why Brain Tumor Detection?
          </h3>
          <ul className="list-disc pl-6 text-white text-lg font-bold space-y-1">
            <li>
              Brain <span className="text-cyan-400">tumors</span> often go
              undetected until it's too late.
            </li>
            <li>
              Early and accurate diagnosis is critical for effective treatment.
            </li>
            <li>
              We want to empower doctors and patients with cutting-edge AI tools
              that support better decisions.
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold italic text-cyan-400 mb-1">
            How It Works
          </h3>
          <ul className="list-disc pl-6 text-white text-lg font-bold space-y-1">
            <li>
              Users upload <span className="text-cyan-400">MRI</span> scans
              through our Brain Tumor AI tool.
            </li>
            <li>Our AI model analyzes the scan in seconds.</li>
            <li>
              A clear, concise result is returned — identifying tumor type and
              possible severity.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
