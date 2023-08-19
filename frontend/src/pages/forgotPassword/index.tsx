import { authService } from '@/shared/services/auth.service'
import { Button, Card, Form, Input, message, Typography } from 'antd'
import { getCookie, setCookie } from 'cookies-next'
import { useMutation } from 'react-query'
import BlankLayout from '@/shared/layout/BlankLayout'
import { useNavigate } from 'react-router-dom'
type Props = {}

const ForgotPassword = ({ }: Props) => {
    const navigate = useNavigate()
    const loginMutation = useMutation({
        mutationKey: 'forgotPassword',
        mutationFn: (body: { username: string, oldPassword: string, newPassword: string}) => authService.forgetPassword(body),
        onSuccess(data, _variables, _context) {
            const res = data.data.data
            message.success(
                    'Yêu cầu mật khẩu thành công',
            );
            navigate("/login")
        },
        onError(error, variables, context) {
            message.error(
                'Yêu cầu mật khẩu không thành công',
            );
        },
    })
    function handleLogin(value: {username: string, oldPassword: string, newPassword: string}) {
        loginMutation.mutate(value)
    }
    return (
        <BlankLayout>
            <div className='w-full h-screen mx-auto flex justify-center items-center'>
            <Card
                title="Trang tìm mật khẩu"
                style={{ minWidth: 400 }}
                extra={<img style={{ maxWidth: 50, maxHeight: 50 }} alt="logo" src="/profile.png" />}
            >
                <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={handleLogin}
                    autoComplete="off"
                    layout='vertical'
                >
                    <Form.Item
                        label="Tài khoản"
                        name="username"
                        rules={[{ required: true, message: "Vui lòng nhập tài khoản", }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu cũ"
                        name="oldPassword"
                        rules={[{ required: true,  message: "Vui lòng nhập mật khẩu cũ"}]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu mới"
                        name="newPassword"
                        rules={[{ required: true,  message: "Vui lòng nhập mật khẩu mới"}]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Typography.Link className='flex justify-end items-end' href="/login">Login</Typography.Link>
                    <Form.Item className='mt-5' style={{ textAlign: "center" }}>
                        <Button htmlType="submit" loading={loginMutation.isLoading}>
                            Yêu cầu
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            
            </div>
        </BlankLayout>

    )
}
export default ForgotPassword

