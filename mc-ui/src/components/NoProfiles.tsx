import { Empty, Button } from 'antd';
import { UserOutlined, ReloadOutlined } from '@ant-design/icons';

interface NoProfilesProps {
    onRefresh: () => void;
}

const NoProfiles: React.FC<NoProfilesProps> = ({ onRefresh }) => {
    return (
        <Empty
            className="mt-12"
            image={<UserOutlined style={{ fontSize: 64, color: '#ff69b4' }} />}
            imageStyle={{ height: 60 }}
            description={
                <span>
                    No profiles found
                </span>
            }
        >
            <p style={{ color: '#8c8c8c', marginBottom: 16 }}>
                Don't worry! Your perfect match might be just around the corner.
            </p>
            <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={onRefresh}
            >
                Refresh Profiles
            </Button>
        </Empty>
    );
};

export default NoProfiles;
