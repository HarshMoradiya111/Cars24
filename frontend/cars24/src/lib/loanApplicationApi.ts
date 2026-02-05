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
  // Create a new loan application
  createLoanApplication: async (data: LoanApplicationData): Promise<LoanApplicationData> => {
    try {
      const response = await fetch(`${API_BASE_URL}/LoanApplication`, {
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
          // If response body is empty or not JSON, use default message
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

  // Get all loan applications
  getAllLoanApplications: async (): Promise<LoanApplicationData[]> => {
    const response = await fetch(`${API_BASE_URL}/LoanApplication`);

    if (!response.ok) {
      throw new Error("Failed to fetch loan applications");
    }

    return response.json();
  },

  // Get loan application by ID
  getLoanApplicationById: async (id: string): Promise<LoanApplicationData> => {
    const response = await fetch(`${API_BASE_URL}/LoanApplication/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch loan application");
    }

    return response.json();
  },

  // Get loan applications by user ID
  getLoanApplicationsByUserId: async (userId: string): Promise<LoanApplicationData[]> => {
    const response = await fetch(`${API_BASE_URL}/LoanApplication/user/${userId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch user loan applications");
    }

    return response.json();
  },

  // Get loan applications by status
  getLoanApplicationsByStatus: async (status: string): Promise<LoanApplicationData[]> => {
    const response = await fetch(`${API_BASE_URL}/LoanApplication/status/${status}`);

    if (!response.ok) {
      throw new Error("Failed to fetch loan applications by status");
    }

    return response.json();
  },

  // Update loan application
  updateLoanApplication: async (id: string, data: LoanApplicationData): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/LoanApplication/${id}`, {
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

  // Delete loan application
  deleteLoanApplication: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/LoanApplication/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete loan application");
    }
  },
};
