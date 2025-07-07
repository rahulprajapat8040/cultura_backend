import { BadRequestException, NotFoundException } from "@nestjs/common"

export const SendError = (message: string) => {
    throw new BadRequestException(message)
}

export const otpGenerator = (size: number) => {
    const value = Math.pow(10, size - 1);
    return Math.floor(value + Math.random() * (9 * value));
};

export const responseSender = (message: string, status: number, success: boolean, data: object | [] | null) => {
    return { message, data, status, success }
}

export const genratePagination = (data: { rows: any[], count: number }, page: number, limit: number) => {
    return {
        data: data.rows,
        pageInfo: {
            total: data.count,
            currentPage: page,
            totalPage: Math.ceil(data.count / limit)
        }
    }
}

export const parameterNotFound = (key: string, message: string) => {
    if (!key) {
        throw new NotFoundException(message)
    }
}