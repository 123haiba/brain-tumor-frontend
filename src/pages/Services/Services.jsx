import Accordion from "../../components/Shared/Accordion";

export default function Services() {
  return (
    <div className="min-h-screen px-2 py-8 flex flex-col items-center">
      <div className="max-w-4xl w-full mx-auto bg-transparent rounded-2xl p-6 sm:p-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold italic text-white mb-4">
          Supporting Brain <span className="text-cyan-400">Tumor</span> Research
          & Organizations:
        </h2>
        <p className="text-lg sm:text-xl font-semibold italic text-white mb-8">
          Explore key resources from leading brain tumor organizations and stay
          informed on the latest research advancements. Together, we're working
          towards better detection, treatment, and{" "}
          <span className="font-bold">support</span>.
        </p>
        <div className="space-y-2">
          <Accordion title="National Brain Tumor Society (NBTS)">
            NBTS is the largest nonprofit organization in the U.S. dedicated to
            the brain tumor community. They focus on funding research,
            advocating for patients, and providing educational resources.
            <a
              href="https://braintumor.org/"
              className="text-blue-500 hover:text-blue-600"
            >
              National Brain Tumor Society
            </a>
          </Accordion>
          <Accordion title="GammaTile Therapy for Glioblastoma">
            Researchers are exploring the use of GammaTile therapy in newly
            diagnosed glioblastoma patients. This approach aims to improve
            outcomes for one of the most challenging brain cancers.
            <a
              href="https://www.kucancercenter.org/news-room/blog/2024/08/breakthroughs-in-brain-cancer-research"
              className="text-blue-500 hover:text-blue-600"
            >
              GammaTile Therapy for Glioblastoma
            </a>
          </Accordion>
          <Accordion title="Brain Tumour Foundation of Canada">
            This organization provides support, education, and research funding
            for brain tumor patients and their families across Canada.{" "}
            <a
              href="https://www.braintumour.ca/"
              className="text-blue-500 hover:text-blue-600"
            >
              Brain Tumour Foundation of Canada
            </a>
          </Accordion>
          <Accordion title="Advancements in Diagnosis and Treatment">
            A comprehensive review published in Brain Sciences discusses recent
            progress in neuroimaging and intra-operative techniques, enhancing
            the safety and effectiveness of brain tumor diagnoses and
            resections.
            <a
              href="https://braintumor.org/"
              className="text-blue-500 hover:text-blue-600"
            >
              National Brain Tumor Society
            </a>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
