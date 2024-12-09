import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../store/themeConfigSlice';
import { Modal, Button, Checkbox, TextInput, Select } from '@mantine/core';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const API_URL = import.meta.env.VITE_API_URL; 

interface Org {
  nameorg: string;
  nameadmin: string;
  emailadmin: string;
  addressadmin: string;
  phoneadmin: string;
  statusOrg: string;
  timestamp: string;
  tokeorg: string;
  businessBase64: string;
  historyOrg: any[];
  hospitalbranch: any[];
  users: User[];
}

interface User {
  fullname: string;
  address: string;
  phone: string;
  typeusers: string;
  cccd: string;
}

export default function HospitalApproval() {
  const MySwal = withReactContent(Swal);

  const [datatable, setdatatable] = useState<Org[]>([]);
  const [recordsData, setRecordsData] = useState<Org[]>([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Org | null>(null);
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);

  // New state for filtering
  const [searchName, setSearchName] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const dispatch = useDispatch();
  const handleApproveClick = async (org: Org) => {
    console.log('Organization approved:', org.nameorg, org.tokeorg);
  
    // Hiển thị modal chờ
    const loadingSwal: any = MySwal.fire({
      title: 'Please wait...',
      text: 'Approval Hospital a group, please wait!',
      icon: 'info',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  
    try {
      // Gửi yêu cầu POST đầu tiên tới API để tạo thư mục tổ chức
      const response = await fetch(`${API_URL}/creater-org-folders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: org.nameorg,
          tokeorg: org.tokeorg,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      const outputData = result.data.output.org;
      console.log(outputData);
      // Gửi yêu cầu POST thứ hai tới API Laravel để lưu thông tin tổ chức
    
  
      // Đóng modal chờ và hiển thị thông báo thành công
      loadingSwal.close();
      MySwal.fire({
        title: 'Hospital Success',
        text: 'Add to Hospital in Success',
        icon: 'success',
      });
  
      // console.log('Response from server:', await responses.json());
    } catch (error) {
      // Xử lý lỗi và hiển thị thông báo thất bại
      console.error('Error when creating organization:', error);
      loadingSwal.close();
      MySwal.fire({
        title: 'Hospital Error',
        text: 'Add to Hospital in error',
        icon: 'error',
      });
    }
  };
  
  const showdata = async () => {
    try {
      const response = await fetch(`${API_URL}/show-all-org`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: any = await response.json();
      console.log(data);
      setdatatable(data);
      // Check if data and data.org are defined and if data.org is an array
      // if (data && data.org && Array.isArray(data.org)) {
      //   const filteredData: Org[] = data.org.filter((org: any) => org.statusOrg === 'false');
      //   setdatatable(filteredData);
      //   filterData(filteredData); // Apply filter to data after fetching
      // } else {
      //   console.error('Unexpected response structure:', data);
      // }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Filter the data based on search input and status
  const filterData = (data: Org[]) => {
    let filteredData = data;

    if (searchName) {
      filteredData = filteredData.filter((org) =>
        org.nameorg.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (statusFilter) {
      filteredData = filteredData.filter((org) => org.statusOrg === statusFilter);
    }

    setRecordsData(filteredData.slice(0, pageSize));
  };

  useEffect(() => {
    dispatch(setPageTitle('Basic Table'));
  }, [dispatch]);

  useEffect(() => {
    showdata();
  }, []);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecordsData(datatable.slice(from, to));
  }, [page, pageSize, datatable]);

  useEffect(() => {
    filterData(datatable);
  }, [searchName, statusFilter]);

  const handleDetailClick = (org: Org) => {
    setSelectedOrg(org);
    setModalOpen(true);
  };

  const handleSelectChange = (orgId: string) => {
    if (selectedOrgs.includes(orgId)) {
      setSelectedOrgs(selectedOrgs.filter((id) => id !== orgId));
    } else {
      setSelectedOrgs([...selectedOrgs, orgId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedOrgs.length === recordsData.length) {
      setSelectedOrgs([]);
    } else {
      setSelectedOrgs(recordsData.map((org) => org.tokeorg));
    }
  };
 

  const handleSynchronizeClick = async (record:any) => {
    try {
      const data = {
        nameorg: record.nameorg,
        nameadmin: record.nameadmin,
        cccd:  record.users[0]?.cccd,
        emailadmin: record.emailadmin,
        tokenorg: record.tokeorg,
        phoneadmin: record.phoneadmin,
        businessBase64:  record.users[0]?.cccd,
        password: record.users[0]?.password,
        addressadmin: record.addressadmin,
        imgidentification: record.users[0]?.cccd,
        username: record.nameorg,
    };
    
    // Ghi log dữ liệu ra console
    console.log('Data being sent:', data);
      const responses = await fetch(`http://127.0.0.1:8000/api/organizations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include', // Bật chế độ xác thực
        body: JSON.stringify(data),
      });
  
      // if (!responses.ok) {
      //   const errorData = await responses.json();
      //   console.error('Error from server:', errorData); // Log lỗi chi tiết
      //   throw new Error('Error saving organization to the Laravel API');
      // }
  
      const _data = await responses.json();
      console.log('Success:', _data);
      if(_data.status===true){
        MySwal.fire({
          title: 'Hospital Success',
          text: 'Add to Hospital in Success',
          icon: 'success',
          
        });
      }else{
        MySwal.fire({
          
          title: 'Hospital Error',
          text: 'Add to Hospital in error',
          icon: 'error',
        });
      
      }
  
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <div>
      <div className="panel mt-6">
        <h5 className="font-semibold text-lg dark:text-white-light mb-5">Quản lý phê duyệt bệnh viện</h5>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <TextInput
            placeholder="Tìm kiếm theo tên bệnh viện"
            value={searchName}
            onChange={(event) => setSearchName(event.currentTarget.value)}
          />
          <Select
            placeholder="Lọc theo trạng thái"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value || '')}
            data={[
              { value: 'true', label: 'Approved' },
              { value: 'false', label: 'Pending' },
            ]}
          />
        </div>
        <div className="datatables">
          <DataTable
            noRecordsText="Không có kết quả phù hợp với yêu cầu tìm kiếm"
            highlightOnHover
            className="whitespace-nowrap table-hover"
            records={recordsData}
            columns={[
              {
                accessor: 'select',
                title: <Checkbox onChange={handleSelectAll} checked={selectedOrgs.length === recordsData.length} />,
                render: (record) => (
                  <Checkbox
                    checked={selectedOrgs.includes(record.tokeorg)}
                    onChange={() => handleSelectChange(record.tokeorg)}
                  />
                ),
              },
              { accessor: 'nameorg', title: 'Tên bệnh viện' },
              { accessor: 'statusOrg', title: 'Trạng thái' },
              {
                accessor: 'Detail',
                title: 'Chi tiết',
                render: (record) => (
                  <Button onClick={() => handleDetailClick(record)}>Xem chi tiết</Button>
                ),
              },
              {
                accessor: 'Approve',
                title: 'Chấp thuận',
                render: (record) => (
                  <Button
                  color={record.statusOrg === "true" ? 'green' : 'green'}
                  onClick={() => {
                    if (record.statusOrg === "true") {
                      handleSynchronizeClick(record);
                    } else {
                      handleApproveClick(record);
                    }
                  }}
                >
                  {record.statusOrg === "true" ? 'Đồng bộ SQL' : 'Approve'} 
                </Button>
                
                ),
              },
            ]}
            totalRecords={datatable.length}
            recordsPerPage={pageSize}
            page={page}
            onPageChange={setPage}
            recordsPerPageOptions={PAGE_SIZES}
            onRecordsPerPageChange={setPageSize}
            minHeight={200}
            paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
          />
        </div>
      </div>

      {/* Modal for viewing organization details */}
      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Organization Details">
        {selectedOrg && (
          <div>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <Zoom>
                <img
                  src={`${selectedOrg.businessBase64}`}
                  alt="Organization logo"
                  style={{ width: '150px', height: '150px', borderRadius: '50%', cursor: 'pointer' }}
                />
              </Zoom>
            </div>
            <div>
              <label>
                <strong>Tên bệnh viện:</strong>
              </label>
              <input type="text" value={selectedOrg.nameorg} readOnly className="form-input" />
            </div>
            <div>
              <label>
                <strong>Tên Admin:</strong>
              </label>
              <input type="text" value={selectedOrg.nameadmin} readOnly className="form-input" />
            </div>
            <input
                type="email"
                value={selectedOrg.emailadmin}
                readOnly
                className="form-input"
              />
            <div>
              <label>
                <strong>Địa chỉ Admin:</strong>
              </label>
              <input
                type="text"
                value={selectedOrg.addressadmin}
                readOnly
                className="form-input"
              />
            </div>
            <div>
              <label>
                <strong>Điện thoại Admin:</strong>
              </label>
              <input
                type="text"
                value={selectedOrg.phoneadmin}
                readOnly
                className="form-input"
              />
            </div>
            <div>
              <label>
                <strong>Trạng thái:</strong>
              </label>
              <input
                type="text"
                value={selectedOrg.statusOrg === 'true' ? 'Approved' : 'Pending'}
                readOnly
                className="form-input"
              />
            </div>
            <div>
              <label>
                <strong>Mốc thời gian:</strong>
              </label>
              <input
                type="text"
                value={new Date(parseInt(selectedOrg.timestamp)).toLocaleString()}
                readOnly
                className="form-input"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
