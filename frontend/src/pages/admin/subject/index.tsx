import Dashboard from "@/shared/layout/Dashboard";
import { subjectService } from "@/shared/services/subject.service";
import { ISubject } from "@/shared/typeDef/subject.type";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, message, Popconfirm, Row, Space, Table, Tag } from "antd";
import Search from "antd/es/input/Search";
import { ColumnType } from "antd/es/table";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import FormSubject from "./form";

type Props = {};

const SubjectManagement = ({}: Props) => {
  const [open, setOpen] = useState(false);
  const [action, setAtion] = useState<string>("");
  const [rowId, setRowId] = useState<number>();
  const { data: dataSubject, refetch } = useQuery(
    ['listSubject'],
    () => subjectService.getAllSubject()
  );
  const deleteMutation = useMutation({
    mutationKey: ["deleteSubjectMutation"],
    mutationFn: (id: number) => subjectService.deleteSubject(id),
    onSuccess: () => {
      message.success("Xoá thành công");
      refetch();
    },
    onError() {
      message.error("Xoá không thành công");
    },
  });
  const columns: ColumnType<ISubject>[] = [
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
      title: "Mã học phần",
      dataIndex: "ma_mon_hoc",
      key: "ma_mon_hoc",
    },
    {
      title: "Tên học phần",
      dataIndex: "name",
      key: "name",
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
      {dataSubject && (
        <Dashboard>
          <Row justify={"space-between"} align="middle" gutter={16}>
            <Col span={12}>
              <h1 className="font-bold text-2xl">Quản lý học phần</h1>
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
          <Table dataSource={dataSubject.data} columns={columns} />
          {action === "create" && !rowId ? (
            <FormSubject refetch={refetch} open={open} setOpen={setOpen} />
          ) : (
            <FormSubject refetch={refetch} editId={rowId} open={open} setOpen={setOpen} />
          )}
        </Dashboard>
      )}
    </>
  );
};
export default SubjectManagement;
