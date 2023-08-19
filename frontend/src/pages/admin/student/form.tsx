import { useMutation, useQuery } from "react-query";
import { Button, Form, Input, message, Modal, Row, Col, Select, DatePicker } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { departmentService } from "@/shared/services/department.service";
import { studentService } from "@/shared/services/student.service";
import { classService } from "@/shared/services/class.service";
import { formattedDate } from "@/shared/utils/convertDay";
import dayjs from "dayjs";

interface Props {
  editId?: number;
  open: any;
  setOpen: any;
  refetch: any;
}
const FormStudent = ({ editId, open, setOpen, refetch }: Props) => {
  const [form] = useForm();
  const [departmentId, setDepartmentId] = useState<number>();
  const isDepartmentIdValidNumber = typeof departmentId === "number";
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
  const { data: listClassByDepartment } = useQuery(
    ["class", departmentId],
    () => classService.getClassByDepartment(departmentId as number),
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
      enabled: isDepartmentIdValidNumber,
    }
  );

  const { data } = useQuery(
    ["student"],
    () => studentService.getStudentById(editId as number),
    {
      enabled: isEditIdValidNumber,
    }
  );
  const createMutation = useMutation({
    mutationKey: "create",
    mutationFn: (body: {
      department_id: number;
      class_id: number;
      ma_sinh_vien: string;
      name: string;
      birthday: string;
    }) => studentService.newStudent(body),
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
      class_id: number;
      ma_sinh_vien: string;
      name: string;
      birthday: string;
    }) => studentService.updateStudent(editId as number, body),
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
      setDepartmentId(data.data.class_id)
      const formData = {
        ...data.data,
        birthday: dayjs(data.data.birthday),
        class_id: listClassByDepartment
      }
      form.setFieldsValue(formData);
    }
  }, [editId && data]);
  const handleChange = (value: any) => {
    setDepartmentId(value);
  };
  return (
    <Modal
      title={editId ? `Chỉnh sửa sinh viên` : "Tạo sinh viên mới"}
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
          <Select options={listDepartment} onChange={handleChange} />
        </Form.Item>

        <Form.Item label="Tên lớp" name="class_id">
          <Select options={listClassByDepartment} />
        </Form.Item>

        <Form.Item
          label="Mã sinh viên"
          name="ma_sinh_vien"
          rules={[{ required: true, message: "Vui lòng ký mã sinh viên" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Tên sinh viên"
          name="name"
          rules={[{ required: true, message: "Vui lòng ký tên" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Ngày sinh"
          name="birthday"
          rules={[{ required: true, message: "Vui lòng ký ngày sinh" }]}
        >
          <DatePicker />
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

export default FormStudent;
