import React, { useEffect, useState } from 'react';
import CodeHighlight from '../components/Highlight';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import IconCircleCheck from '../components/Icon/IconCircleCheck';
import IconXCircle from '../components/Icon/IconXCircle';
import Dropdown from '../components/Dropdown';
import {Hospital} from '../model/HospitalModel';
import { useHospital } from '../controller/HospitalController'; // Sử dụng hook quản lý hospital
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ManagementNetwork = () => {
  const MySwal = withReactContent(Swal);

  const dispatch = useDispatch();
  const [networkName, setNetworkName] = useState('');
  const [orgCount, setOrgCount] = useState(1);
  const [channelName, setChannelName] = useState('');
  const [networks, setNetworks] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [chaincodeName, setChaincodeName] = useState('');
  const [chaincodeVersion, setChaincodeVersion] = useState('');
  const { addHospital } = useHospital();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [adminInfo, setAdminInfo] = useState({
    nameorg: '',
    nameadmin: '',
    emailadmin: '',
    addressadmin: '',
    cccdadmin: '',
    phoneadmin: '',
    passworkadmin: '',
    businessBase64: ''
  });


  const base64img = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Check if files are selected
    if (file) {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        const base64String = reader.result as string; // The result is the base64 string
        console.log(base64String); // You can use this base64 string as needed
        setAdminInfo({ ...adminInfo, businessBase64: base64String });

      };

  
      reader.readAsDataURL(file); // Convert the file to base64
    }
  };
  
  const handleAddHospital = async () => {
      const loadingSwal:any = MySwal.fire({
      title: 'Please wait...',
      text: 'New Hospital a group, please wait!',
      icon: 'info',
      allowOutsideClick: false, // Prevent closing the modal while loading
      showConfirmButton: false, // Hide the confirmation button
      didOpen: () => {
        Swal.showLoading(); // Show the loading animation
      }
    });
    // API call to add a new hospital with admin information
   const result:any = await addHospital(adminInfo);
   console.log(result.success);
    loadingSwal.close();

   if(result.success===true){
    MySwal.fire({
      title: 'Add to Hospital',
      text: 'Add to Hospital in Success',
      icon: 'success',
    });
   }else{
    MySwal.fire({
      title: 'Add to Hospital',
      text: 'Add to Hospital in error',
      icon: 'error',
    });
   }
  
  
  };

  useEffect(() => {
    dispatch(setPageTitle('Add New Hospital'));
    // Fetch existing networks here
  }, [dispatch]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tạo bệnh viện mới</h1>

    
   


      {/* Add Hospital Form */}
      <div className="bg-white p-6 shadow rounded-lg mb-6">
        <h2 className="text-xl mb-4">Thêm bệnh viện</h2>
        <div className="mb-4">
          <label className="block mb-2">Tên bệnh viện</label>
          <input
            type="text"
            value={adminInfo.nameorg}
            onChange={(e) => setAdminInfo({ ...adminInfo, nameorg: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Nhập tên bệnh viện"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Tên Admin</label>
          <input
            type="text"
            value={adminInfo.nameadmin}
            onChange={(e) => setAdminInfo({ ...adminInfo, nameadmin: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Nhập tên Admin"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">ID Admin (CCCD)</label>
          <input
            type="text"
            value={adminInfo.cccdadmin}
            onChange={(e) => setAdminInfo({ ...adminInfo, cccdadmin: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Nhập ID Admin (CCCD)"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Email Admin</label>
          <input
            type="email"
            value={adminInfo.emailadmin}
            onChange={(e) => setAdminInfo({ ...adminInfo, emailadmin: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Nhập Email Admin"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Địa chỉ Admin</label>
          <input
            type="text"
            value={adminInfo.addressadmin}
            onChange={(e) => setAdminInfo({ ...adminInfo, addressadmin: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Nhập địa chỉ Admin"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Số điện thoại Admin</label>
          <input
            type="text"
            value={adminInfo.phoneadmin}
            onChange={(e) => setAdminInfo({ ...adminInfo, phoneadmin: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Nhập số điện thoại Admin"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Mật khẩu Admin</label>
          <input
            type="password"
            value={adminInfo.passworkadmin}
            onChange={(e) => setAdminInfo({ ...adminInfo, passworkadmin: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Nhập mật khẩu Admin"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Hình ảnh doanh nghiệp (cơ sở)</label>
          <input
            type="file"
            onChange={base64img}
            // onChange={(e) => {
            //   const file = e.target.files[0];
            //   const reader = new FileReader();
            //   reader.onloadend = () => {
            //     setAdminInfo({ ...adminInfo, businessBase64: reader.result });
            //   };
            //   if (file) {
            //     reader.readAsDataURL(file);
            //   }
            // }}
            className="w-full p-2 border rounded"
          />
        </div>
        <button onClick={handleAddHospital} className="bg-blue-500 text-white px-4 py-2 rounded">
          Thêm bệnh viện
        </button>
      </div>
   
    </div>
    
  );
};

export default ManagementNetwork;
