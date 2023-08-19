import Dashboard from "@/shared/layout/Dashboard";
import { attendenceService } from "@/shared/services/attendence.service";
import { IAttendence } from "@/shared/typeDef/attendence.type";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, message, Popconfirm, Row, Space, Table, Tag } from "antd";
import Search from "antd/es/input/Search";
import { ColumnType } from "antd/es/table";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import FormAttendence from "./form";

type Props = {};

const AttendenceManagement = ({}: Props) => {
  const [open, setOpen] = useState(false);
  const [action, setAtion] = useState<string>("");
  const [rowId, setRowId] = useState<number>();
  const { data: dataAttendence, refetch } = useQuery(
    ['listAttendence'],
    () => attendenceService.getAllAttendence()
  );
  const deleteMutation = useMutation({
    mutationKey: ["deleteAttendenceMutation"],
    mutationFn: (id: number) => attendenceService.deleteAttendence(id),
    onSuccess: () => {
      message.success("Xoá thành công");
      refetch();
    },
    onError() {
      message.error("Xoá không thành công");
    },
  });
  const columns: ColumnType<IAttendence>[] = [
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
      render: (_, record) => (
        <p>{record && record.department.name}</p>
      )
    },
    {
      title: "Tên lớp",
      key: "class_id",
      render: (_, record) => (
        <p>{record && record.class.name}</p>
      )
    },
    {
      title: "Mã sinh viên",
      key: "ma_sinh_vien",
      render: (_, record) => (
        <p>{record && record.student.ma_sinh_vien}</p>
      )
    },
    {
      title: "Tên sinh viên",
      key: "student_id",
      render: (_, record) => (
        <p>{record && record.student.name}</p>
      )
    },
    {
      title: "Tên học phần",
      key: "subject_id",
      render: (_, record) => (
        <p>{record && record.subject.name}</p>
      )
    },
    {
      title: "Số buổi",
      key: "number",
      render: (value, record, index) => (
        <Tag color={"blue"}>
          {record.number}
        </Tag>
      ),
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
            okButtonProps={{ style: { background: 'red', color: 'white' }, loading: deleteMutation.isLoading }}
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
      {dataAttendence && (
        <Dashboard>
          <Row justify={"space-between"} align="middle" gutter={16}>
            <Col span={12}>
              <h1 className="font-bold text-2xl">Quản lý điểm danh</h1>
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
          <Table dataSource={dataAttendence.data} columns={columns} />
          {action === "create" && !rowId ? (
            <FormAttendence refetch={refetch} open={open} setOpen={setOpen} />
          ) : (
            <FormAttendence refetch={refetch} editId={rowId} open={open} setOpen={setOpen} />
          )}
        </Dashboard>
      )}
    </>
  );
};
export default AttendenceManagement;
