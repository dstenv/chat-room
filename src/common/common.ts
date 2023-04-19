import type { ChatType } from '@/types/message'

export namespace CommonConfig {
    /** 创建群组邀请多少人时需要对方同意才可进入群聊 */
    export const CREATE_GROUP_MAXUSER = 5
    /** 创建群组的基础配置 */
    export const CREATE_GROUP_CONFIG = {
        // 是否允许普通群成员邀请人入群
        allowinvites: true,
        // 邀请加群时是否需要受邀用户确认
        inviteNeedConfirm: true,
        // 群组最大成员数
        maxusers: 50,
        // 是否为公开群
        public: true,
        // 入群申请是否需群主或管理员审批
        approval: true,
    }
    /** 不分页获取群组列表，一次性拿完 */
    export const GET_GROUP_LIST_SIZE = 500
    /** 会话列表的携带信息中的chatType不准确，需要转换 */
    export const CHAT_TYPE: Record<string, ChatType> = {
        chat: 'singleChat',
        groupchat: 'groupChat',
    }
}
