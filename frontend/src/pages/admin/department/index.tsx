import Dashboard from "@/shared/layout/Dashboard";
import { dataUserFake } from "@/shared/mock";
import { departmentService } from "@/shared/services/department.service";
import { userService } from "@/shared/services/user.service";
import { IDepartment } from "@/shared/typeDef/department.type";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, message, Popconfirm, Row, Space, Table, Tag } from "antd";
import Search from "antd/es/input/Search";
import { ColumnType } from "antd/es/table";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import FormUser from "./form";

type Props = {};

const DepartmentManagement = ({}: Props) => {
  const [open, setOpen] = useState(false);
  const [action, setAtion] = useState<string>("");
  const [rowId, setRowId] = useState<number>();
  const { data: dataDepartment, refetch } = useQuery(
    ['listDepartment'],
    () => departmentService.getAllDepartment(),
  );
  const deleteMutation = useMutation({
    mutationKey: ["deleteDepartmentMutation"],
    mutationFn: (id: number) => departmentService.deletedepartment(id),
    onSuccess: () => {
      message.success("Xoá thành công");
      refetch();
    },
    onError() {
      message.error("Xoá không thành công");
    },
  });
  const columns: ColumnType<IDepartment>[] = [
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
      title: "Mã khoa",
      dataIndex: "ma_khoa",
      key: "ma_khoa",
    },
    {
      title: "Tên",
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
      {dataDepartment && (
        <Dashboard>
          <Row justify={"space-between"} align="middle" gutter={16}>
            <Col span={12}>
              <h1 className="font-bold text-2xl">Quản lý khoa</h1>
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
          <Table dataSource={dataDepartment.data} columns={columns} />
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
export default DepartmentManagement;
