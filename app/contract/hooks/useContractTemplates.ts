import { useEffect, useState } from "react";
import { secureStorage } from "../../utils/secureStorage";

interface ContractForm {
  [key: string]: any;
}

interface UseContractTemplatesProps {
  form: ContractForm;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

export function useContractTemplates({ form, showToast }: UseContractTemplatesProps) {
  const [templates, setTemplates] = useState<ContractForm[]>([]);

  useEffect(() => {
    const loadTemplates = async () => {
      const savedTemplates = await secureStorage.getItem("contractTemplates");
      if (savedTemplates) {
        try {
          setTemplates(savedTemplates);
        } catch (e) {
          console.error("Failed to load templates:", e);
        }
      }
    };
    loadTemplates();
  }, []);

  const saveTemplate = async (templateName: string) => {
    const newTemplate = { ...form, templateName };
    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    await secureStorage.setItem("contractTemplates", updatedTemplates);
    showToast("Template saved successfully", "success");
  };

  const deleteTemplate = async (index: number) => {
    const updatedTemplates = templates.filter((_, i) => i !== index);
    setTemplates(updatedTemplates);
    await secureStorage.setItem("contractTemplates", updatedTemplates);
    showToast("Template deleted", "success");
  };

  const loadTemplate = (template: ContractForm) => {
    return template;
  };

  return {
    templates,
    setTemplates,
    saveTemplate,
    deleteTemplate,
    loadTemplate,
  };
}
