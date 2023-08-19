import { useMutation, useQuery } from "react-query";
import { Button, Form, Input, message, Modal, Row, Col, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { departmentService } from "@/shared/services/department.service";
import { APP_ROLE_DEFAULT } from "@/shared/constant/AppConstant";
import { classService } from "@/shared/services/class.service";

interface Props {
  editId?: number;
  open: any;
  setOpen: any;
  refetch: any;
}
const FormUser = ({ editId, open, setOpen, refetch }: Props) => {
  const [form] = useForm();
  const isEditIdValidNumber = typeof editId === "number";
  const { data: listDepartment } = useQuery(
    ["department"],
    () => departmentService.getAllDepartment(),
    {
      select(data) {
        const res = data.data;
        const result = res.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
        return result;
      },
    }
  );
  const { data } = useQuery(
    ["class"],
    () => classService.getClassById(editId as number),
    {
      enabled: isEditIdValidNumber,
    }
  );
  const createMutation = useMutation({
    mutationKey: "create",
    mutationFn: (body: {
      department_id: number;
      ma_lop_hoc: string;
      name: string;
    }) => classService.newClass(body),
    onSuccess(data, _variables, _context) {
      const res = data.data;
      if (!res) return;
      message.success("Tạo thành công");
      setOpen(false);
      refetch();
    },
    onError(error, variables, context) {
      message.error("Tạo không thành công");
    },
  });
  const updateMutation = useMutation({
    mutationKey: "update",
    mutationFn: (body: {
      department_id: number;
      ma_lop_hoc: string;
      name: string;
    }) => classService.updateClass(editId as number, body),
    onSuccess(data, _variables, _context) {
      const res = data.data;
      if (!res) return;
      message.success("Cập nhật thành công");
      setOpen(false);
      refetch();
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
      title={editId ? `Chỉnh sửa lớp` : "Tạo lớp mới"}
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
        <Form.Item label="Tên khoa" name="department_id">
          <Select options={listDepartment} />
        </Form.Item>

        <Form.Item
          label="Mã lớp"
          name="ma_lop_hoc"
          rules={[{ required: true, message: "Vui lòng ký mã lớp" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Tên lớp"
          name="name"
          rules={[{ required: true, message: "Vui lòng ký tên" }]}
        >
          <Input />
        </Form.Item>
        <Row justify={"center"} align={"middle"} gutter={16}>
          <Col>
            <Form.Item style={{ textAlign: "center" }}>
              <Button
                onClick={() => {
                  setOpen(false);
                }}
                htmlType="button"
              >
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
