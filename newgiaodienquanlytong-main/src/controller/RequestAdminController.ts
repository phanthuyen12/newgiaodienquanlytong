export const GetFullRequestAllAdmin = async () => {
    try {
        const response = await fetch("http://103.179.185.78:3002/managentnetwork/changeadmin", {
          method: "get",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify(formData),
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log("Success:", data.data);
          return data;
        //   alert('Success')
          // You can add navigation or success handling here
        } else {
          const error = await response.json();
          console.error("Error:", error);
          return error
          // Handle error response from server
        }
      } catch (err) {
        console.error("Network error:", err);
        // Handle network errors here
      }
};
export const ChannelAdmin = async (formData: any) => {
    try {
      // Gửi yêu cầu thay đổi admin
      const response = await fetch("http://103.179.185.78:3002/change-admin", {
        method: "POST",  // Chỉnh lại thành "POST"
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Success:", data.status);
  
        // Kiểm tra nếu yêu cầu thay đổi admin thành công
        if (data.status === true) {
          // Gửi yêu cầu cập nhật thông tin mạng
          const updateResponse = await fetch("http://103.179.185.78:3002/managentnetwork/update", {
            method: "POST",  // Chỉnh lại thành "POST"
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
  
          if (updateResponse.ok) {
            const updateData = await updateResponse.json();
            console.log("Network update successful:", updateData);
            return updateData;  // Trả về kết quả của yêu cầu cập nhật mạng
          } else {
            const updateError = await updateResponse.json();
            console.error("Error in updating network:", updateError);
            return updateError;  // Trả về lỗi nếu yêu cầu cập nhật mạng thất bại
          }
        } else {
          console.error("Admin change failed:", data);
          return data;  // Trả về lỗi nếu thay đổi admin không thành công
        }
      } else {
        const error = await response.json();
        console.error("Error in changing admin:", error);
        return error;  // Trả về lỗi nếu yêu cầu thay đổi admin thất bại
      }
    } catch (err) {
      console.error("Network error:", err);
      return { error: "Network error", details: err };  // Trả về lỗi mạng nếu có
    }
  };
  