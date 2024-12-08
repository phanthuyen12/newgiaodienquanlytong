// Không cần require dotenv
import { Hospital } from './../model/HospitalModel';

// Sử dụng biến môi trường đã cấu hình
const API_URL = import.meta.env.VITE_API_URL; 

export const createHospital = async (hospital: Hospital): Promise<Hospital> => {
  const response = await fetch(`${API_URL}/creater-org/`, {
    method: "POST",
    body: JSON.stringify(hospital),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to create hospital: ${response.statusText}`);
  }

  const data: any = await response.json();
  return data;  // Trả về đối tượng Hospital
};
