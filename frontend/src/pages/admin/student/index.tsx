import Dashboard from "@/shared/layout/Dashboard";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, message, Popconfirm, Row, Space, Table, Tag } from "antd";
import { ColumnType } from "antd/es/table";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import FormStudent from "./form";
import { IStudent } from "@/shared/typeDef/student.type";
import { studentService } from "@/shared/services/student.service";
import { formattedDate } from "@/shared/utils/convertDay";
import Search from "antd/es/input/Search";

type Props = {};

const StudentManagement = ({}: Props) => {
  const [open, setOpen] = useState(false);
  const [action, setAtion] = useState<string>("");
  const [rowId, setRowId] = useState<number>();
  const { data: dataStudent, refetch } = useQuery(["listStudent"], () =>
    studentService.getAllStudent()
  );
  const deleteMutation = useMutation({
    mutationKey: ["deleteStudentMutation"],
    mutationFn: (id: number) => studentService.deleteStudent(id),
    onSuccess: () => {
      message.success("Xoá thành công");
      refetch();
    },
    onError() {
      message.error("Xoá không thành công");
    },
  });
  const columns: ColumnType<IStudent>[] = [
    {
      title: "#",
      key: "id",
      render: (value, record, index) => (
        <div>
          <p>{index}</p>
        </div>
      ),
    },
    {
      title: "Tên khoa",
      key: "department_id",
      render: (_, record) => <p>{record && record.department.name}</p>,
    },
    {
      title: "Tên lớp",
      key: "class_id",
      render: (_, record) => <p>{record && record.class.name}</p>,
    },
    {
      title: "Mã sinh viên",
      dataIndex: "ma_sinh_vien",
      key: "ma_sinh_vien",
    },
    {
      title: "Tên sinh viên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày sinh",
      key: "birthday",
      render: (_, record) => <p>{record && formattedDate(record.birthday)}</p>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <div
            className="cursor-pointer"
            onClick={() => {
              setAtion("edit");
              setOpen(true);
              setRowId(record.id);
            }}
          >
            <EditOutlined />
          </div>
          <Popconfirm
            okButtonProps={{
              style: { background: "red", color: "white" },
              loading: deleteMutation.isLoading,
            }}
            onConfirm={() => {
              deleteMutation.mutate(record.id);
            }}
            title={"Xoá"}
          >
            <DeleteOutlined className="cursor-pointer"></DeleteOutlined>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {dataStudent && (
        <Dashboard>
          <Row justify={"space-between"} align="middle" gutter={16}>
            <Col span={12}>
              <h1 className="font-bold text-2xl">Quản lý sinh viên</h1>
            </Col>
            <Col span={12}>
              <div className="flex py-2 justify-between items-center gap-3">
                <Search
                  className="bg-blue-300 rounded-lg"
                  placeholder="Tìm kiếm"
                  onSearch={() => {}}
                  enterButton
                />
                <Button
                  onClick={() => {
                    setAtion("create");
                    setRowId(NaN);
                    setOpen(true);
                  }}
                >
                  Tạo mới
                </Button>
              </div>
            </Col>
          </Row>
          <Table dataSource={dataStudent.data} columns={columns} scroll={{ x: "100vw", y: 580 }} />
          {action === "create" && !rowId ? (
            <FormStudent refetch={refetch} open={open} setOpen={setOpen} />
          ) : (
            <FormStudent
              refetch={refetch}
              editId={rowId}
              open={open}
              setOpen={setOpen}
            />
          )}
        </Dashboard>
      )}
    </>
  );
};
export default StudentManagement;
