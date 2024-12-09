import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { GetFullRequestAllAdmin ,ChannelAdmin} from '../controller/RequestAdminController';

interface ChangeRequest {
  id: string;
  hospitalName: string;
  oldDoctor: string;
  newDoctor: string;
  reason: string;
  status: 'Đang chờ' | 'Đã phê duyệt' | 'Đã từ chối';
  timeCreated: string;
}

const RequestAdminHospital = () => {
  const [requests, setRequests] = useState<ChangeRequest[]>([]);
  const [search, setSearch] = useState<string>('');
  const MySwal = withReactContent(Swal);

  const mapStatus = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Đang chờ';
      case 'APPROVED':
        return 'Đã phê duyệt';
      case 'REJECTED':
        return 'Đã từ chối';
      default:
        return 'Không xác định';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(parseInt(timestamp)).toLocaleString('vi-VN');
  };

  const fetchRequests = async () => {
    try {
      const response = await GetFullRequestAllAdmin();
      if (response && Array.isArray(response)) {
        const formattedRequests = response.flatMap((org) =>
          org.adminChangeHistory.map((req: any) => {
            // Ensure required fields are available
            const oldDoctorName = req.namecurrentAdminToken || req.currentAdminToken || 'Không có tên';
            const newDoctorName = req.namenewAdminToken || req.newAdminToken || 'Không có tên';
            const nameOrg = req.nameOrg || org.organizationToken;
  
            // Error handling for invalid data
            if (!req.requestId || !org.organizationToken) {
              console.warn('Dữ liệu không hợp lệ:', req);
              return null;
            }
  
            return {
              id: req.requestId,
              hospitalName: nameOrg,
              hospitalToken:  org.organizationToken,
              oldDoctor: oldDoctorName,
              tokenoldDoctorcurrent: req.currentAdminToken,
              tokenoldDoctornew: req.newAdminToken,
              newDoctor: newDoctorName,
              reason: req.reason,
              status: mapStatus(req.status),
              timeCreated: formatTimestamp(req.timestamp),
            };
          })
        );
  
        // Remove null values
        setRequests(formattedRequests.filter(Boolean));
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };
  
  useEffect(() => {
    fetchRequests();
  }, []);

//   import Swal from 'sweetalert2'; // Đảm bảo bạn đã import SweetAlert2

// import Swal from 'sweetalert2';
const handleApprove = async (id: string, hospitalToken: string, newDoctor: string, oldDoctor: string) => {
    try {
      // Hiển thị modal xác nhận
      const result = await Swal.fire({
        title: 'Bạn có chắc chắn muốn đổi tài khoản admin?',
        text: `Việc này sẽ chuyển quyền admin từ bác sĩ cũ (${oldDoctor}) sang bác sĩ mới (${newDoctor}).`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Có, tôi chắc chắn',
        cancelButtonText: 'Hủy',
        reverseButtons: true, // Đảo vị trí của các nút
      });
  
      // Kiểm tra nếu người dùng nhấn "Có, tôi chắc chắn"
      if (result.isConfirmed) {
        console.log(`Phê duyệt yêu cầu đổi tài khoản admin: ${id}`);
  
        // Hiển thị modal "Đang đợi" khi yêu cầu đang được xử lý
        Swal.fire({
          title: 'Đang đợi...',
          text: 'Vui lòng chờ trong khi chúng tôi xử lý yêu cầu của bạn.',
          icon: 'info',
          showConfirmButton: false,
          allowOutsideClick: false,  // Ngừng các hành động khác ngoài việc chờ
        });
  
        // Gửi yêu cầu cập nhật quyền admin
        const data = {
          id: id,
          tokenorg: hospitalToken,
          oldTokenUser: oldDoctor,
          newTokenUser: newDoctor,
        };
        console.log(data);
  
        // Gọi hàm ChannelAdmin để xử lý dữ liệu
        const res = await ChannelAdmin(data);
  
        if (res.status === true) { // Kiểm tra status là true
          // Nếu thành công, thông báo và cập nhật trạng thái
          Swal.fire('Thành công!', 'Yêu cầu đã được phê duyệt.', 'success');
          
          // Cập nhật trạng thái trong state nếu cần
          // setRequests((prev) =>
          //   prev.map((req) =>
          //     req.id === id ? { ...req, status: 'Đã phê duyệt' } : req
          //   )
          // );
        } else {
          // Nếu có lỗi khi cập nhật
          Swal.fire('Lỗi!', 'Có lỗi xảy ra khi cập nhật quyền admin.', 'error');
        }
      } else {
        // Nếu người dùng nhấn "Hủy"
        Swal.fire('Đã hủy', 'Yêu cầu không được thay đổi.', 'info');
      }
    } catch (error) {
      // Xử lý lỗi bất đồng bộ
      console.error('Lỗi khi phê duyệt yêu cầu:', error);
      Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi phê duyệt yêu cầu.', 'error');
    }
  };
  



  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: 'Đã từ chối' } : req
      )
    );
    MySwal.fire('Thành công!', 'Yêu cầu đã bị từ chối.', 'error');
  };

  const handleViewDetails = (token: string) => {
    MySwal.fire('Thông tin chi tiết', `Chi tiết bác sĩ: ${token}`, 'info');
  };

  const filteredRequests = requests.filter(
    (req) =>
      req.hospitalName.toLowerCase().includes(search.toLowerCase()) ||
      req.oldDoctor.toLowerCase().includes(search.toLowerCase()) ||
      req.newDoctor.toLowerCase().includes(search.toLowerCase()) ||
      req.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="panel mt-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý yêu cầu đổi bác sĩ</h1>

      <div className="bg-white p-6 shadow rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h2 className="text-xl mb-2 md:mb-0">Danh sách yêu cầu</h2>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="border border-gray-300 p-2 rounded w-full md:w-1/3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Tên bệnh viện</th>
                <th className="border border-gray-300 px-4 py-2">Bác sĩ cũ</th>
                <th className="border border-gray-300 px-4 py-2">Bác sĩ mới</th>
                <th className="border border-gray-300 px-4 py-2">Lý do</th>
                <th className="border border-gray-300 px-4 py-2">Thời gian tạo</th>
                <th className="border border-gray-300 px-4 py-2">Trạng thái</th>
                <th className="border border-gray-300 px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
  {filteredRequests.map((request:any) => (
    <tr key={request.id}>
      <td className="border border-gray-300 px-4 py-2">{request.hospitalName}</td>
      <td className="border border-gray-300 px-4 py-2">
        {request.oldDoctor}{' '}
        <button
          onClick={() => handleViewDetails(request.oldDoctor)}
          className="text-blue-500 underline hover:text-blue-700"
        >
          Xem chi tiết
        </button>
      </td>
      <td className="border border-gray-300 px-4 py-2">
        {request.newDoctor}{' '}
        <button
          onClick={() => handleViewDetails(request.newDoctor)}
          className="text-blue-500 underline hover:text-blue-700"
        >
          Xem chi tiết
        </button>
      </td>
      <td className="border border-gray-300 px-4 py-2">{request.reason}</td>
      <td className="border border-gray-300 px-4 py-2">{request.timeCreated}</td>
      <td
        className={`border border-gray-300 px-4 py-2 ${
          request.status === 'Đã phê duyệt'
            ? 'text-green-500'
            : request.status === 'Đã từ chối'
            ? 'text-red-500'
            : 'text-yellow-500'
        }`}
      >
        {request.status}
      </td>
      <td className="border border-gray-300 px-4 py-2">
        {request.status === 'Đang chờ' && (
          <div className="flex gap-2">
            <button
              onClick={() => handleApprove(request.id,request.hospitalToken,request.tokenoldDoctornew,request.tokenoldDoctorcurrent)}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Phê duyệt
            </button>
            <button
              onClick={() => handleReject(request.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Từ chối
            </button>
          </div>
        )}
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default RequestAdminHospital;
