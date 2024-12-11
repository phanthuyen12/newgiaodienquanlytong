import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../store/themeConfigSlice';
const API_URL = import.meta.env.VITE_API_URL;


const Analytics = () => {

    const [totalHospitalTrue, settotalHospitalTrue] = useState(0);
    const [totalHospitalFalse, settotalHospitalFalse] = useState(0);
    const [totalPatient, setTotalPatient] = useState(0);
    const [totalMember, setTotalMember] = useState(0);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Analytics Admin'));
    });

    const showdata = async () => {
        try {
            //lấy danh sách bệnh viện đã đc phê duyệt
            const response1 = await fetch(`${API_URL}/true/show-all-org`);
            if (!response1.ok) {
                throw new Error('Network response was not ok');
            }
            const data1: any = await response1.json();
            const totalHospital1 = data1.length;
            settotalHospitalTrue(totalHospital1);
            console.log("vinh200", data1);


            //lấy danh sách bệnh viện chưa đc phê duyệt
            const response2 = await fetch(`${API_URL}/false/show-all-org`);
            if (!response2.ok) {
                throw new Error('Network response was not ok');
            }
            const data2: any = await response2.json();
            const totalHospital2 = data2.length;
            settotalHospitalFalse(totalHospital2);

            //lấy danh sách thành viên
            const response3 = await fetch(`${API_URL}/out/count-medical`, { //thay đổi API Đếm Thành Viên
                method: 'POST',
            });
            if (!response3.ok) {
                throw new Error('Network response was not ok');
            }
            const data3: any = await response3.json();
            const totalMembers = data3.data;
            setTotalMember(totalMembers);

            //lấy danh sách sổ khám
            const response4 = await fetch(`${API_URL}/out/count-medical`, {
                method: 'POST',
            });
            if (!response4.ok) {
                throw new Error('Network response was not ok');
            }
            const data4: any = await response4.json();
            console.log("vinh100", data4);
            const totalPatients = data4.data;
            setTotalPatient(totalPatients);
        } catch (error) {
            console.error('Error fetching data:', error);
            settotalHospitalTrue(0);
            settotalHospitalFalse(0);
            setTotalMember(0);
            setTotalPatient(0);

        }
    };
    useEffect(() => {
        showdata();
    }, [])


    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/" className="text-primary hover:underline">
                        Trang Chủ
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Thống Kê</span>
                </li>
            </ul>
            <div className="pt-5">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="panel h-full">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="text-center font-semibold text-lg">Tổng số bệnh viện chờ duyệt</h5>
                        </div>
                        <div className="text-[#e95f2b] text-center text-3xl font-bold my-10">
                            <span>{totalHospitalFalse}</span>
                        </div>
                    </div>
                    <div className="panel h-full">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className=" text-center font-semibold text-lg">Tổng số bệnh viện đã duyệt</h5>
                        </div>
                        <div className="text-[#e95f2b] text-center text-3xl font-bold my-10">
                            <span>{totalHospitalTrue}</span>
                        </div>
                    </div>
                    <div className="panel h-full">
                        <div className=" flex justify-between dark:text-white-light mb-5">
                            <h5 className=" font-semibold text-lg">Tổng số thành viên đăng ký</h5>
                        </div>
                        <div className="text-[#e95f2b] text-center text-3xl font-bold my-10">
                            <span>{totalMember}</span>
                        </div>
                    </div>
                    <div className="panel h-full">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="text-center font-semibold text-lg">Tổng số sổ khám đã đăng ký</h5>
                        </div>
                        <div className="text-[#e95f2b] text-center text-3xl font-bold my-10">
                            <span>{totalPatient}</span>
                        </div>
                    </div>
                </div>
                <div className="account-card pt-3 border p-5 rounded-lg shadow-lg bg-white">
                    <h4>
                        <span style={{ color: "#e74c3c" }}>
                            <strong>Lưu ý:</strong>
                        </span>{" "}
                        Hãy đảm bảo tài khoản đăng nhập và mật khẩu của bạn không khớp với thông
                        tin đăng nhập trên các website khác để tránh trường hợp chủ website khác
                        sử dụng thông tin của bạn để đăng nhập vào phần mềm quản lý bệnh viện này!
                    </h4>

                    <p>&nbsp;</p>

                    <p>
                        <img
                            alt="hospital-management"
                            src="http://localhost/CMSNT.CO/SHOPCLONE7/public/ckeditor/plugins/smiley/images/thumbs_up.png"
                            title="hospital-management"
                        />{" "}
                        Thay đổi nội dung tại -&gt; <strong>Trang Quản Trị</strong> -&gt;{" "}
                        <strong>Cài Đặt</strong> -&gt; <strong>Thông báo ngoài trang chủ</strong>
                    </p>

                    <p>&nbsp;</p>

                    <div className="bg-gray-100 p-4 rounded-lg mt-5">
                        <h4 className="font-semibold text-lg">
                            <span style={{ color: "#3498db" }}>
                                <strong>Thông tin phần mềm quản lý bệnh viện:</strong>
                            </span>
                        </h4>Statistics

                        <ul className="list-disc ml-5 mt-3">
                            <li>
                                <strong>Quản lý bệnh nhân:</strong> Tạo, cập nhật thông tin bệnh nhân,
                                lịch sử thăm khám, và các thông tin liên quan đến điều trị.
                            </li>
                            <li>
                                <strong>Quản lý bác sĩ:</strong> Thêm, sửa, xóa bác sĩ, phân công công
                                việc, và theo dõi lịch khám bệnh.
                            </li>
                            <li>
                                <strong>Quản lý thuốc:</strong> Quản lý kho thuốc, kiểm soát tồn kho,
                                và theo dõi việc cấp phát thuốc.
                            </li>
                            <li>
                                <strong>Chăm sóc khách hàng:</strong> Gửi thông báo, lịch hẹn khám, và
                                theo dõi phản hồi từ bệnh nhân.
                            </li>
                            <li>
                                <strong>Báo cáo thống kê:</strong> Tạo báo cáo về số lượng bệnh nhân,
                                doanh thu, chi phí, và các chỉ số quan trọng khác.
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Analytics;
