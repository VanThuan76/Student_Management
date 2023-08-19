import { Layout } from 'antd';

interface Props {
    children: React.ReactNode;
}
const BlankLayout = ({ children }:Props) => {
    return (
        <Layout>
            <div className='py-2 min-h-screen'>
                {children}
            </div>
        </Layout>
    );
}

export default BlankLayout;