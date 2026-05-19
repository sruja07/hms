export const libraryData: Record<string, any> = {
  "breast-cancer": {
    type: "disease",
    overview: "Breast cancer is a disease in which cells in the breast grow out of control. It is one of the most common cancers diagnosed in women worldwide. Early detection through regular mammograms and clinical exams significantly improves the chances of successful treatment.",
    symptoms: ["New lump in the breast or underarm", "Thickening or swelling of part of the breast", "Irritation or dimpling of breast skin", "Redness or flaky skin in the nipple area", "Pulling in of the nipple or pain", "Nipple discharge other than breast milk"],
    causes: "The exact cause is unknown, but risk factors include genetic mutations (BRCA1/BRCA2), increasing age, family history, radiation exposure, obesity, and starting menopause at an older age.",
    treatments: [
      { title: "Surgery", desc: "Mastectomy (removal of the whole breast) or lumpectomy (removal of the tumor)." },
      { title: "Radiation Therapy", desc: "Using high-energy rays to target and kill remaining cancer cells." },
      { title: "Chemotherapy & Hormone Therapy", desc: "Systemic treatments used to shrink tumors or prevent cancer cells from getting the hormones they need to grow." }
    ]
  },
  "hypertension": {
    type: "disease",
    overview: "Hypertension, or high blood pressure, is a common condition in which the long-term force of the blood against your artery walls is high enough that it may eventually cause health problems, such as heart disease.",
    symptoms: ["Often asymptomatic (the 'silent killer')", "Headaches (in severe cases)", "Shortness of breath", "Nosebleeds", "Flushing or dizziness"],
    causes: "Primary hypertension has no identifiable cause and develops over years. Secondary hypertension can be caused by kidney problems, adrenal gland tumors, certain defects you're born with, or medications like birth control pills.",
    treatments: [
      { title: "Lifestyle Changes", desc: "Eating a heart-healthy diet with less salt, getting regular physical activity, and maintaining a healthy weight." },
      { title: "Medications", desc: "Diuretics, ACE inhibitors, calcium channel blockers, and angiotensin II receptor blockers." },
      { title: "Continuous Monitoring", desc: "Regular blood pressure checks to adjust treatments." }
    ]
  },
  "diabetes-mellitus": {
    type: "disease",
    overview: "Diabetes mellitus refers to a group of diseases that affect how your body uses blood sugar (glucose). Glucose is vital to your health because it's an important source of energy for the cells that make up your muscles and tissues.",
    symptoms: ["Increased thirst and frequent urination", "Extreme hunger", "Unexplained weight loss", "Presence of ketones in the urine", "Fatigue and irritability", "Blurred vision"],
    causes: "Type 1 diabetes occurs when the immune system attacks insulin-producing cells. Type 2 diabetes stems from a combination of genetics and lifestyle factors, leading to insulin resistance.",
    treatments: [
      { title: "Insulin Therapy", desc: "Required for Type 1 diabetes and sometimes for Type 2, to regulate blood sugar levels." },
      { title: "Diet and Exercise", desc: "A cornerstone of managing both types of diabetes, focusing on low glycemic index foods." },
      { title: "Oral Medications", desc: "Drugs like Metformin that improve insulin sensitivity or stimulate insulin production." }
    ]
  },
  "stroke": {
    type: "disease",
    overview: "A stroke occurs when the blood supply to part of your brain is interrupted or reduced, preventing brain tissue from getting oxygen and nutrients. Brain cells begin to die in minutes.",
    symptoms: ["Sudden numbness or weakness in the face, arm, or leg (especially on one side)", "Sudden confusion, trouble speaking, or difficulty understanding speech", "Sudden trouble seeing in one or both eyes", "Sudden trouble walking, dizziness, or loss of balance", "Sudden severe headache with no known cause"],
    causes: "An ischemic stroke is caused by a blocked artery (blood clot). A hemorrhagic stroke is caused by the leaking or bursting of a blood vessel.",
    treatments: [
      { title: "Emergency IV Medication", desc: "Tissue plasminogen activator (tPA) to dissolve the clot if given quickly." },
      { title: "Endovascular Procedures", desc: "Removing the clot directly from the blocked blood vessel." },
      { title: "Rehabilitation", desc: "Physical, occupational, and speech therapy to regain lost skills." }
    ]
  },
  "leukemia": {
    type: "disease",
    overview: "Leukemia is cancer of the body's blood-forming tissues, including the bone marrow and the lymphatic system. It usually involves the white blood cells, which grow abnormally and crowd out healthy cells.",
    symptoms: ["Fever or chills", "Persistent fatigue or weakness", "Frequent or severe infections", "Losing weight without trying", "Swollen lymph nodes, enlarged liver or spleen", "Easy bleeding or bruising"],
    causes: "Scientists don't understand the exact causes of leukemia. It seems to develop from a combination of genetic and environmental factors, including exposure to high levels of radiation or certain chemicals.",
    treatments: [
      { title: "Chemotherapy", desc: "The major form of treatment for leukemia, using chemicals to kill leukemia cells." },
      { title: "Targeted Therapy", desc: "Drugs that focus on specific vulnerabilities present within cancer cells." },
      { title: "Bone Marrow Transplant", desc: "Replacing diseased bone marrow with healthy bone marrow (stem cells)." }
    ]
  },
  "chemotherapy": {
    type: "treatment",
    overview: "Chemotherapy is a drug treatment that uses powerful chemicals to kill fast-growing cells in your body. It is most frequently used to treat cancer, since cancer cells grow and multiply much more quickly than most cells in the body.",
    details: "Chemotherapy drugs can be used alone or in combination to treat a wide variety of cancers. While effective, chemotherapy carries a risk of significant side effects because it also targets fast-growing healthy cells, such as those in hair follicles and the digestive tract.",
    expectations: [
      "Administration: Can be given via pill, injection, or most commonly, an intravenous (IV) infusion.",
      "Duration: Given in cycles (e.g., daily, weekly, or monthly) with rest periods in between.",
      "Side Effects: Fatigue, hair loss, nausea, vomiting, and increased risk of infection."
    ]
  },
  "dialysis": {
    type: "treatment",
    overview: "Dialysis is a procedure to remove waste products and excess fluid from the blood when the kidneys stop working properly. It often involves diverting blood to a machine to be cleaned.",
    details: "When kidneys fail (end-stage renal disease), dialysis keeps the body in balance by removing waste, salt, and extra water to prevent them from building up in the body. It also helps control blood pressure.",
    expectations: [
      "Hemodialysis: Uses an artificial kidney (hemodialyzer) to remove waste. Often done in a clinic 3 times a week.",
      "Peritoneal Dialysis: Uses the lining of your abdomen and a cleaning solution to filter blood inside your body.",
      "Lifestyle: Requires strict dietary changes, specifically limiting sodium, phosphorus, and potassium."
    ]
  },
  "chest-pain": {
    type: "symptom",
    overview: "Chest pain appears in many forms, ranging from a sharp stab to a dull ache. It is a highly variable symptom that can signify a minor issue like heartburn, or a life-threatening emergency like a heart attack.",
    details: "Because it can indicate a severe cardiovascular problem, chest pain should never be ignored. If the pain radiates to your arm, neck, or jaw, or is accompanied by shortness of breath, seek emergency medical care immediately.",
    expectations: [
      "Cardiac Causes: Heart attack, angina, pericarditis, or aortic dissection.",
      "Gastrointestinal Causes: Heartburn, swallowing disorders, or gallstones.",
      "Musculoskeletal Causes: Muscle soreness, injured ribs, or costochondritis."
    ]
  },
  "mri-basics": {
    type: "diagnostic",
    overview: "Magnetic Resonance Imaging (MRI) is a non-invasive imaging technology that produces three dimensional detailed anatomical images. It is often used for disease detection, diagnosis, and treatment monitoring.",
    details: "Unlike X-rays and CT scans, MRI does not use damaging ionizing radiation. Instead, it relies on a powerful magnetic field and radio waves to generate images of the organs in the body.",
    expectations: [
      "Preparation: You must remove all metal objects (jewelry, watches) before entering the scanner.",
      "Procedure: You will lie inside a large, tube-like machine. It can be loud, and you must remain very still.",
      "Usage: Excellent for examining the brain, spinal cord, joints, heart, and blood vessels."
    ]
  }
};

export function getFallbackContent(title: string, slug: string) {
  const lowerSlug = slug.toLowerCase();

  // Treatments & Procedures
  if (lowerSlug.includes("surgery") || lowerSlug.includes("therapy") || lowerSlug.includes("transplant") || lowerSlug.includes("dialysis") || lowerSlug.includes("angioplasty") || lowerSlug.includes("insertion")) {
    return {
      type: "treatment",
      overview: `${title} is a specialized medical procedure offered at Tulsi Hospitals. Our world-class medical team utilizes the latest technology and evidence-based practices to perform this treatment safely and effectively.`,
      details: `The goal of ${title} is to improve patient outcomes, manage underlying conditions, and enhance overall quality of life. We ensure a comprehensive pre-evaluation and post-care recovery plan for every patient.`,
      expectations: [
        "A thorough consultation and diagnostic evaluation prior to the procedure.",
        "Execution by board-certified specialists using state-of-the-art medical technology.",
        "A dedicated post-treatment care and rehabilitation plan."
      ]
    };
  }
  
  // Symptoms
  if (lowerSlug.includes("pain") || lowerSlug.includes("fatigue") || lowerSlug.includes("loss") || lowerSlug.includes("fever") || lowerSlug.includes("breath") || lowerSlug.includes("headache") || lowerSlug.includes("issues")) {
    return {
      type: "symptom",
      overview: `${title} is a medical symptom that can be associated with various underlying health conditions. It is important to have this evaluated by a healthcare professional to determine the exact cause.`,
      details: `While ${title} may sometimes be benign or self-limiting, it can also be an early indicator of a more serious illness requiring prompt medical intervention.`,
      expectations: [
        "Schedule an appointment for a physical examination and medical history review.",
        "Undergo specific diagnostic tests, such as blood work or imaging, to identify the root cause.",
        "Receive a targeted treatment plan to alleviate the symptom and address the condition."
      ]
    };
  }

  // Diagnostics & Tests
  if (lowerSlug.includes("ultrasound") || lowerSlug.includes("scan") || lowerSlug.includes("mri") || lowerSlug.includes("test") || lowerSlug.includes("panel") || lowerSlug.includes("count") || lowerSlug.includes("diagnostic")) {
    return {
      type: "diagnostic",
      overview: `${title} is an advanced diagnostic procedure used by our medical professionals to accurately assess your health condition and guide treatment decisions.`,
      details: `At Tulsi Hospitals, we utilize state-of-the-art equipment to perform ${title}. This allows for highly precise, non-invasive (or minimally invasive) data collection, enabling our doctors to formulate the best possible care plan.`,
      expectations: [
        "Clear instructions from our staff on how to prepare beforehand.",
        "A safe, efficient procedure conducted by certified medical technicians.",
        "Rapid, accurate results delivered directly to your physician for review."
      ]
    };
  }

  // Medicines
  if (lowerSlug.includes("medicine") || lowerSlug.includes("drug") || lowerSlug.includes("vaccine") || lowerSlug.includes("antibiotic") || lowerSlug.includes("medication") || lowerSlug.includes("pharmacy")) {
    return {
      type: "medicine",
      overview: `${title} involves the administration of pharmaceutical interventions to manage, treat, or prevent medical conditions effectively.`,
      details: `Our pharmacy and clinical teams work closely to ensure that ${title} is prescribed safely, taking into account your medical history, allergies, and potential interactions with other treatments.`,
      expectations: [
        "A detailed consultation to explain dosage, frequency, and purpose.",
        "Continuous monitoring by your healthcare provider to assess efficacy.",
        "Guidance on potential side effects and how to manage them."
      ]
    };
  }

  // Health Technology
  if (lowerSlug.includes("technology") || lowerSlug.includes("app") || lowerSlug.includes("wearable") || lowerSlug.includes("telemedicine") || lowerSlug.includes("ai") || lowerSlug.includes("robotic") || lowerSlug.includes("electronic") || lowerSlug.includes("guide")) {
    return {
      type: "technology",
      overview: `${title} represents Tulsi Hospitals' commitment to integrating cutting-edge innovation into patient care for more efficient and accessible health management.`,
      details: `By leveraging ${title}, we empower patients and doctors alike with real-time data, enhanced surgical precision, and seamless remote communication.`,
      expectations: [
        "Improved accuracy and efficiency in diagnosis and treatment.",
        "Enhanced patient convenience and access to care from anywhere.",
        "Strict adherence to data privacy and digital security standards."
      ]
    };
  }

  // Default fallback (Disease/Condition)
  return {
    type: "disease",
    overview: `${title} is a clinical condition that requires careful diagnosis and a personalized treatment approach. At Tulsi Hospitals, our multidisciplinary team of experts utilizes state-of-the-art technology to provide comprehensive care.`,
    symptoms: ["Persistent pain or localized discomfort", "Unexplained fatigue or weakness", "Changes in physical functions or daily routines", "Other specific symptoms determined by diagnostic testing"],
    causes: `The exact cause of ${title} can vary. Several contributing factors may increase the risk, including genetics, environmental exposure, lifestyle choices, and underlying health metrics.`,
    treatments: [
      { title: "Medical Interventions", desc: "Advanced medications or clinical procedures designed to address the root cause and alleviate symptoms." },
      { title: "Lifestyle Management", desc: "Dietary modifications, physical therapy, and guided care to improve overall wellbeing." },
      { title: "Ongoing Support", desc: "Continuous monitoring by our dedicated care team to ensure long-term health." }
    ]
  };
}
