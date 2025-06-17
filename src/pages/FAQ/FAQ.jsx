import Accordion from "../../components/Shared/Accordion";
import { FaExclamationTriangle } from "react-icons/fa";

export default function FAQ() {
  return (
    <div className="flex flex-col items-center px-2 ">
      <div className=" max-w-7xl w-full bg-transparent rounded-2xl p-6 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">
          AI <span className="text-cyan-400">Brain</span> Scan Tool –{" "}
          <span className="text-cyan-400">Common</span> Questions
        </h2>
        <div className="space-y-2 mb-8">
          <Accordion title="Can this tool detect the size or stage of a tumor?">
            No, the tool currently focuses on detecting the presence and type of
            tumor, not its size or stage. Medical imaging experts are needed for
            detailed analysis.
          </Accordion>
          <Accordion title="How accurate is the tumor detection system?">
            Our system has been trained on a large dataset and achieves high
            accuracy, but no AI model is 100% perfect. Results should be
            reviewed by a healthcare provider.
          </Accordion>
          <Accordion title="What should I do after getting the detection result?">
            If the result indicates a possible tumor, it's important to consult
            a neurologist or radiologist for further evaluation and diagnosis.
          </Accordion>
          <Accordion title="Can I use this tool without medical knowledge?">
            Yes, the tool is designed to be user-friendly for both professionals
            and individuals seeking early insights.
          </Accordion>
          <Accordion title="What types of brain tumors can this tool detect?">
            The system is trained to identify major types like glioma,
            meningioma, and pituitary tumors based on MRI scan patterns.
          </Accordion>
        </div>
        <div className="mt-8 flex items-start gap-2">
          <FaExclamationTriangle className="text-yellow-400 text-2xl mt-1" />
          <div>
            <span className="font-bold text-cyan-400 text-lg">Disclaimer</span>
            <p className="text-white font-extrabold text-lg mt-1">
              This tool is for informational purposes only and not a replacement
              for professional medical advice or diagnosis. Always consult a
              healthcare provider for medical concerns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
