import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { IRootState } from '../store';
import { setPageTitle } from '../store/themeConfigSlice';
import { newNetworkNoSql, getFullNetwork,startNetwork ,deloyChainCode,stopNetwork} from '../service/NetworkService';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface NetworkData {
  networkName: string;
  status: string;
  chaincodeName: string;
  timecreate?: string; // Optional field
}

const ManagementNetwork = () => {
  const MySwal = withReactContent(Swal);
  const dispatch = useDispatch();
  
  const [networkName, setNetworkName] = useState('');
  const [chaincodeName, setChaincodeName] = useState('');
  const [chaincodeVersion, setChaincodeVersion] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [showData, setShowData] = useState<NetworkData[]>([]);
  const showDataNetwork = async (): Promise<void> => {
    try {
      const res = await getFullNetwork(); 
      const data: NetworkData[] = res.data;
  
      const sortedData = data
        .filter(item => item.timecreate)
        .sort((a, b) => new Date(b.timecreate!).getTime() - new Date(a.timecreate!).getTime());
      
      if (sortedData.length > 0) {
        const mostRecentData = sortedData[0]; // Get the most recent entry
        setShowData([mostRecentData]); // Set state with the most recent data
      }
    } catch (error) {
      console.error('Error fetching network data:', error);
    }
  };
  

  const handleCreateNetwork = async () => {
    try {
      const res = await newNetworkNoSql(networkName);
      console.log(res.newNetwork.status);
      if (res.newNetwork.status===true) {
        MySwal.fire({
          title: 'Success',
          text: 'Network created successfully!',
          icon: 'success',
        });
        showDataNetwork(); // Refresh data
      } else {
        MySwal.fire({
          title: 'Error',
          text: 'Error creating the network.',
          icon: 'error',
        });
      }
    } catch (error) {
      console.error('Error creating network:', error);
    }
  };

  const handleStartNetwork =async (network: NetworkData) => {
    console.log('Starting Network:', network.networkName);
    const loadingSwal:any = MySwal.fire({
      title: 'Vui Lòng Chờ...',
      text: 'Đang Tạo Mới, Vui Lòng Chờ!',
      icon: 'info',
      allowOutsideClick: false, // Prevent closing the modal while loading
      showConfirmButton: false, // Hide the confirmation button
      didOpen: () => {
        Swal.showLoading(); // Show the loading animation
      }
    });
    const res = await startNetwork(network.networkName)
    console.log(res);
    if(res.networkUpdateData.success===true){
      loadingSwal.close();

      MySwal.fire({
        title: 'Hoàn Thành',
        text: 'Khởi Tạo Mạng Thành Công !',
        icon: 'success',
      });
    }else{
      MySwal.fire({
        title: 'Error',
        text: 'Xảy ra lỗi khi khởi tạo mạng.',
        icon: 'error',
      });
    }
    // Call API to start the network
  };

  const handleStopNetwork = async (network: NetworkData) => {
    console.log('Stopping Network:', network);
  
    try {
      // Hiển thị thông báo chờ
      const loadingSwal:any = MySwal.fire({
        title: 'Vui Lòng Chờ...',
        text: 'Đang Dừng Mạng, Vui Lòng Chờ!',
        icon: 'info',
        allowOutsideClick: false, // Ngăn người dùng đóng thông báo trong khi đang xử lý
        showConfirmButton: false, // Ẩn nút xác nhận
        didOpen: () => {
          MySwal.showLoading(); // Hiển thị animation loading
        }
      });
  
      // Gọi API dừng network và chờ kết quả trả về
      const res:any = await stopNetwork(); // Thêm 'await' để đợi kết quả
      console.log(res);
  
      // Đóng thông báo loading sau khi có kết quả
      loadingSwal.close();
  
      if (res.status === true) {
        MySwal.fire({
          title: 'Hoàn Thành',
          text: 'Mạng Đã Được Dừng Thành Công!',
          icon: 'success',
        });
      } else {
        MySwal.fire({
          title: 'Error',
          text: 'Xảy ra lỗi khi dừng mạng.',
          icon: 'error',
        });
      }
  
    } catch (error) {
      // Xử lý lỗi trong quá trình dừng network
      console.error('Error stopping network:', error);
  
      // Đóng thông báo loading nếu có lỗi xảy ra
      MySwal.fire({
        title: 'Error',
        text: 'An error occurred while stopping the network.',
        icon: 'error',
      });
    }
  };
  
  const handleDeployChaincode =async (network: NetworkData) => {
    console.log('Deploying Chaincode:', chaincodeName, chaincodeVersion, network.networkName);
    const loadingSwal:any = MySwal.fire({
      title: 'Please wait...',
      text: 'DeloyChaincode a group, please wait!',
      icon: 'info',
      allowOutsideClick: false, // Prevent closing the modal while loading
      showConfirmButton: false, // Hide the confirmation button
      didOpen: () => {
        Swal.showLoading(); // Show the loading animation
      }
    });
    const res = await deloyChainCode(network.networkName)    // API call to deploy chaincode
    console.log(res);
    if(res.data.status===true){
      loadingSwal.close();

      MySwal.fire({
        title: 'Success',
        text: 'DeloyChaincode successfully!',
        icon: 'success',
      });
    }else{
      MySwal.fire({
        title: 'Error',
        text: 'Error creating the Deloychaincode.',
        icon: 'error',
      });
    }
  };

  const handleDeleteNetwork = (networkName: string) => {
    console.log('Deleting Network:', networkName);
    // Call API to delete the network
    setShowData(showData.filter((network) => network.networkName !== networkName));
  };

  useEffect(() => {
    dispatch(setPageTitle('Fabric Network Management'));
    showDataNetwork(); // Fetch network data on mount
  }, [dispatch]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quản lý mạng Fabric</h1>

      {/* Create New Network */}
      <div className="bg-white p-6 shadow rounded-lg mb-6">
        <h2 className="text-xl mb-4">Tạo Mạng Mới</h2>
        <div className="mb-4">
          <label className="block mb-2">Tên Mạng</label>
          <input
            type="text"
            value={networkName}
            onChange={(e) => setNetworkName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Nhập Vào Tên Mạng"
          />
        </div>
        <button onClick={handleCreateNetwork} className="bg-blue-500 text-white px-4 py-2 rounded">
          Tạo Mới
        </button>
      </div>

      {/* Network Statistics */}
      <div className="bg-white p-6 shadow rounded-lg mb-6">
        <h2 className="text-xl mb-4">Thống Kê Mạng</h2>

        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Tên Mạng</th>
              <th className="border border-gray-300 px-4 py-2">Trạng Thái Chaincode</th>
              <th className="border border-gray-300 px-4 py-2">Trạng thái mạng </th>
              <th className="border border-gray-300 px-4 py-2">Thời gian tạo</th>
              <th className="border border-gray-300 px-4 py-2">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {showData.map((network) => (
              <tr key={network.networkName}>
                <td className="border border-gray-300 px-4 py-2">{network.networkName}</td>
                <td className="border border-gray-300 px-4 py-2">{network.chaincodeName}</td>
                <td className="border border-gray-300 px-4 py-2">{network.status}</td>
                <td className="border border-gray-300 px-4 py-2">{network.timecreate}</td>
                <td className="border border-gray-300 px-4 py-2 flex space-x-2">
                  <button
                    onClick={() => handleStartNetwork(network)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Khởi chạy
                  </button>
                  <button
                    onClick={() => handleDeployChaincode(network)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    triển khai Chaincode
                  </button>
                  <button
                    onClick={() => handleStopNetwork(network)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Dừng
                  </button>
                 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagementNetwork;
