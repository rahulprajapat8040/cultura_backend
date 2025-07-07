import { HttpStatus, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "src/models";
import STRINGCONST from "src/utils/common/stringConst";
import { responseSender, SendError } from "src/utils/helper/funcation.helper";

export class UserService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User
    ) { }

    async getUser(user: User) {
        try {
            const userDetail = await this.userModel.findByPk(user.id)
            if (!userDetail) {
                throw new NotFoundException(STRINGCONST.USER_NOT_FOUND)
            }
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, userDetail)
        } catch (error) {
            SendError(error.message)
        }
    }
}