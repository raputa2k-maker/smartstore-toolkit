export interface CustomOrderDetails {
  methods: string[];
  optionTypes: string[];
}

export interface ProductInfo {
  category: string;
  brand: string;
  series: string;
  productType: string;
  color: string;
  material: string;
  size: string;
  targetGender: string;
  additionalAttributes: string;
  keywords: string[];
  isCustomOrder: boolean;
  customOrderDetails: CustomOrderDetails;
}

export interface FormState extends ProductInfo {
  selectedModel: "gemini-2.5-flash" | "gemini-3-flash-preview";
}

export const initialFormState: FormState = {
  category: "",
  brand: "",
  series: "",
  productType: "",
  color: "",
  material: "",
  size: "",
  targetGender: "",
  additionalAttributes: "",
  keywords: [],
  isCustomOrder: false,
  customOrderDetails: {
    methods: [],
    optionTypes: [],
  },
  selectedModel: "gemini-2.5-flash",
};
