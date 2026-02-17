const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5203"}/api`;

export interface LoanApplicationData {
  id?: string;
  userId?: string;
  name: string;
  phone: string;
  email: string;
  loanAmount: number;
  interestRate: number;
  tenure: number;
  monthlyEMI: number;
  totalAmount: number;
  totalInterest: number;
  status?: string;
  createdAt?: string;
  notes?: string;
}

export const loanApplicationApi = {
  createLoanApplication: async (data: LoanApplicationData): Promise<LoanApplicationData> => {
    try {
      const response = await fetch(`${API_BASE_URL}/loanapplications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorMessage = "Failed to submit loan application";
        try {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const text = await response.text();
      return text ? JSON.parse(text) : data;
    } catch (error: any) {
      console.error("Error creating loan application:", error);
      throw error;
    }
  },

  getAllLoanApplications: async (): Promise<LoanApplicationData[]> => {
    const response = await fetch(`${API_BASE_URL}/loanapplications`);

    if (!response.ok) {
      throw new Error("Failed to fetch loan applications");
    }

    return response.json();
  },

  getLoanApplicationById: async (id: string): Promise<LoanApplicationData> => {
    const response = await fetch(`${API_BASE_URL}/loanapplications/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch loan application");
    }

    return response.json();
  },

  getLoanApplicationsByUserId: async (userId: string): Promise<LoanApplicationData[]> => {
    const response = await fetch(`${API_BASE_URL}/loanapplications/user/${userId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch user loan applications");
    }

    return response.json();
  },

  getLoanApplicationsByStatus: async (status: string): Promise<LoanApplicationData[]> => {
    const response = await fetch(`${API_BASE_URL}/loanapplications/status/${status}`);

    if (!response.ok) {
      throw new Error("Failed to fetch loan applications by status");
    }

    return response.json();
  },

  updateLoanApplication: async (id: string, data: LoanApplicationData): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/loanapplications/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update loan application");
    }
  },

  deleteLoanApplication: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/loanapplications/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete loan application");
    }
  },
};
