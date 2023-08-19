import Dashboard from "@/shared/layout/Dashboard";
import { dataUserFake } from "@/shared/mock";
import { classService } from "@/shared/services/class.service";
import { departmentService } from "@/shared/services/department.service";
import { userService } from "@/shared/services/user.service";
import { IClass } from "@/shared/typeDef/class.type";
import { IDepartment } from "@/shared/typeDef/department.type";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, message, Popconfirm, Row, Space, Table, Tag } from "antd";
import Search from "antd/es/input/Search";
import { ColumnType } from "antd/es/table";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import FormUser from "./form";

type Props = {};

const ClassManagement = ({}: Props) => {
  const [open, setOpen] = useState(false);
  const [action, setAtion] = useState<string>("");
  const [rowId, setRowId] = useState<number>();
  const { data: dataClass, refetch } = useQuery(
    ['listClass'],
    () => classService.getAllClass()
  );
  const deleteMutation = useMutation({
    mutationKey: ["deleteClassMutation"],
    mutationFn: (id: number) => classService.deleteClass(id),
    onSuccess: () => {
      message.success("Xoá thành công");
      refetch();
    },
    onError() {
      message.error("Xoá không thành công");
    },
  });
  const columns: ColumnType<IClass>[] = [
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
      title: "Mã lớp học",
      dataIndex: "ma_lop_hoc",
      key: "ma_lop_hoc",
    },
    {
      title: "Tên lớp",
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
      {dataClass && (
        <Dashboard>
          <Row justify={"space-between"} align="middle" gutter={16}>
            <Col span={12}>
              <h1 className="font-bold text-2xl">Quản lý lớp</h1>
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
          <Table dataSource={dataClass.data} columns={columns} />
          {action === "create" && !rowId ? (
            <FormUser refetch={refetch} open={open} setOpen={setOpen} />
          ) : (
            <FormUser refetch={refetch} editId={rowId} open={open} setOpen={setOpen} />
          )}
        </Dashboard>
      )}
    </>
  );
};
export default ClassManagement;
