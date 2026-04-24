export interface School {
  id: string;
  name: string;
  campusCode: string;
  images: string[];
  category: "existing" | "upcoming";
}

export const schools: School[] = [
  {
    id: "cmr-nps",
    name: "CMR NPS",
    campusCode: "NPS",
    images: ["/images/schools/nps-1.jpg", "/images/schools/nps-2.jpg"],
    category: "existing"
  },
  {
    id: "ekya-byrathi",
    name: "EKYA BYRATHI",
    campusCode: "BYR",
    images: ["/images/schools/byrathi-1.jpg", "/images/schools/byrathi-2.jpg"],
    category: "existing"
  },
  {
    id: "ekya-btm",
    name: "EKYA BTM LAYOUT",
    campusCode: "BTM",
    images: ["/images/schools/btm-1.jpg", "/images/schools/btm-2.jpg"],
    category: "existing"
  },
  {
    id: "ekya-itpl",
    name: "EKYA ITPL",
    campusCode: "ITPL",
    images: ["/images/schools/itpl-1.jpg", "/images/schools/itpl-2.jpg"],
    category: "existing"
  },
  {
    id: "ekya-jpn",
    name: "EKYA JP NAGAR",
    campusCode: "JPN",
    images: ["/images/schools/jpn-1.jpg", "/images/schools/jpn-2.jpg"],
    category: "existing"
  },
  {
    id: "ekya-nice",
    name: "EKYA NICE ROAD",
    campusCode: "NICE",
    images: ["/images/schools/nice-1.jpg", "/images/schools/nice-2.jpg"],
    category: "existing"
  },
  {
    id: "cmrpu-hrbr",
    name: "CMRPU HRBR",
    campusCode: "HRBR",
    images: ["/images/schools/hrbr-1.jpg", "/images/schools/hrbr-2.jpg"],
    category: "existing"
  },
  {
    id: "cmrpu-itpl",
    name: "CMRPU ITPL",
    campusCode: "ITPL_PU",
    images: ["/images/schools/itpl-pu-1.jpg", "/images/schools/itpl-pu-2.jpg"],
    category: "existing"
  },
  {
    id: "cmrpu-btm",
    name: "CMRPU BTM",
    campusCode: "BTM_PU",
    images: ["/images/schools/btm-pu-1.jpg", "/images/schools/btm-pu-2.jpg"],
    category: "existing"
  },
  {
    id: "cmrpu-byrathi",
    name: "CMRPU BYRATHI",
    campusCode: "BYR_PU",
    images: ["/images/schools/byrathi-pu-1.jpg"],
    category: "existing"
  },
  {
    id: "cmrpu-nice-upcoming",
    name: "CMR PU NICE ROAD",
    campusCode: "NICE_PU",
    images: ["/images/schools/upcoming-1.jpg"],
    category: "upcoming"
  }
];
