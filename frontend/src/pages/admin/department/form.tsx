import { useMutation, useQuery } from "react-query";
import { Button, Form, Input, message, Modal, Row, Col } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { departmentService } from "@/shared/services/department.service";

interface Props {
  editId?: number;
  open: any;
  setOpen: any;
  refetch: any
}
const FormUser = ({ editId, open, setOpen, refetch }: Props) => {
  const [form] = useForm();
  const isEditIdValidNumber = typeof editId === "number";
  const { data } = useQuery(
    ["department"],
    () => departmentService.getDepartmentById(editId as number),
    {
      enabled: isEditIdValidNumber,
    }
  );
  const createMutation = useMutation({
    mutationKey: "create",
    mutationFn: (body: { ma_khoa: string; name: string }) =>
      departmentService.newDepartment(body),
    onSuccess(data, _variables, _context) {
      const res = data.data;
      if (!res) return;
      message.success("Tạo thành công");
      setOpen(false);
      refetch()
    },
    onError(error, variables, context) {
      message.error("Tạo không thành công");
    },
  });
  const updateMutation = useMutation({
    mutationKey: "update",
    mutationFn: (body: { ma_khoa: string; name: string }) =>
      departmentService.updateDepartment(editId as number, body),
    onSuccess(data, _variables, _context) {
      const res = data.data;
      if (!res) return;
      message.success("Cập nhật thành công");
      setOpen(false);
      refetch()
    },
    onError(error, variables, context) {
      message.error("Cập nhật không thành công");
    },
  });
  function handleOperation(value: any) {
    if (editId) {
      updateMutation.mutate(value);
    } else {
      createMutation.mutate(value);
    }
  }
  useEffect(() => {
    if (editId && data) {
      form.setFieldsValue(data.data);
    }
  }, [editId && data]);
  return (
    <Modal
      title={editId ? `Chỉnh sửa khoa` : "Tạo khoa mới"}
      centered
      open={open}
      width={1000}
      footer={false}
    >
      <Form
        form={form}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={handleOperation}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label="Mã khoa"
          name="ma_khoa"
          rules={[{ required: true, message: "Vui lòng ký mã khoa" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng ký tên" }]}
        >
          <Input />
        </Form.Item>
        <Row justify={"center"} align={"middle"} gutter={16}>
          <Col>
            <Form.Item style={{ textAlign: "center" }}>
              <Button onClick={() => setOpen(false)} htmlType="button">
                Huỷ bỏ
              </Button>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item style={{ textAlign: "center" }}>
              <Button htmlType="submit">
                {editId ? "Chỉnh sửa" : "Tạo mới"}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default FormUser;
