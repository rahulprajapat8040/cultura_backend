import { BadRequestException, ForbiddenException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Events, Follow, HashTags, MediaFiles, PostHashtags, PostLike, Posts, PostView, User } from "src/models";
import { FileService } from "../file/file.service";
import { genratePagination, responseSender, SendError } from "src/utils/helper/funcation.helper";
import { MulterRequest } from "src/utils/types/multerRequest";
import STRINGCONST from "src/utils/common/stringConst";

@Injectable()
export class ArtistService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        @InjectModel(Posts) private readonly postsModel: typeof Posts,
        @InjectModel(HashTags) private readonly hashtagModel: typeof HashTags,
        @InjectModel(PostHashtags) private readonly postHashtagsModel: typeof PostHashtags,
        @InjectModel(MediaFiles) private readonly mediaFilesModel: typeof MediaFiles,
        @InjectModel(Follow) private readonly followModel: typeof Follow,
        @InjectModel(PostView) private readonly postViewModel: typeof PostView,
        @InjectModel(PostLike) private readonly postLikeModel: typeof PostLike,
        private readonly fileService: FileService
    ) { }

    async createPost(req: MulterRequest) {
        const { file, body } = await this.fileService.uploadFile(req, 'posts')
        try {
            const user = req.user as User
            const post = await this.postsModel.create({
                ...body,
                authorId: user.id
            })
            if (file.length) {
                for (const [index, item] of file.entries()) {
                    await this.mediaFilesModel.create({
                        mediaUrl: item.path,
                        mediaType: item.mimetype,
                        usage: 'post',
                        relatedId: post.id,
                        isThumbnail: index === 0,
                        order: index
                    })
                }
            }
            if (body.hashtags) {
                const tags = JSON.parse(body.hashtags);
                for (const item of tags) {
                    const [tagRecord] = await this.hashtagModel.findOrCreate({
                        where: { tag: item },
                        defaults: { tag: item }
                    });
                    await this.postHashtagsModel.create({
                        hashtagId: tagRecord.id,
                        postId: post.id
                    });
                }
            }
            return responseSender(STRINGCONST.POST_CREATED, HttpStatus.CREATED, true, post)

        } catch (error) {
            SendError(error.message)
        }
    }

    async getArtistInfo(artistId: string, user: User) {
        try {
            const artist = await this.userModel.findByPk(artistId)
            if (!artist) {
                throw new NotFoundException(STRINGCONST.DATA_NOT_FOUND)
            }
            const [followers, posts, isFollowed] = await Promise.all([
                this.followModel.count({ where: { followingId: artistId } }),
                this.postsModel.count({ where: { authorId: artistId } }),
                this.followModel.findOne({ where: { followingId: artistId, followerId: user.id } })
            ]);
            const response = { artist, followers, posts, isFollowed: !!isFollowed }
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, response)
        } catch (error) {
            SendError(error.message)
        }
    }

    async getAllPosts(queryParams) {
        try {
            let { page, limit } = queryParams;
            page = Number(page) || 1
            limit = Number(limit) || 10
            const offset = Number((page - 1) * limit)
            const posts = await this.postsModel.findAndCountAll({
                limit, offset,
                include: [
                    { model: this.postHashtagsModel, include: [{ model: this.hashtagModel }] },
                    { model: this.userModel }
                ],
                distinct: true
            })
            await Promise.all(posts.rows.map(async (p) => {
                (p as any).dataValues.mediaFiles = await this.mediaFilesModel.findAll(
                    {
                        where: { relatedId: p.id },
                        order: [['order', 'ASC']]
                    }
                );
            }));
            const response = genratePagination(posts, page, limit)
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, response)
        } catch (error) {
            SendError(error.message)
        }
    }

    async postViewInc(postId: string, user: User) {
        try {
            const alreadyViewed = await this.postViewModel.findOne({
                where: {
                    postId,
                    viewerId: user.id
                }
            })
            if (!alreadyViewed) {
                await this.postViewModel.create({
                    postId,
                    viewerId: user.id
                })
                const res = await this.postsModel.increment('viewCount', { by: 1, where: { id: postId } })
            }
            return responseSender(STRINGCONST.POST_VIEWED, HttpStatus.CREATED, true, null)
        } catch (error) {
            SendError(error.message)
        }
    }

    async likePost(postId: string, user: User) {
        try {
            const isLiked = await this.postLikeModel.findOne({
                where: { postId, likedById: user.id }
            })
            if (!isLiked) {
                await this.postLikeModel.create({
                    postId, likedById: user.id
                })
            } else {
                await isLiked.destroy({ force: true })
            }
            return responseSender(STRINGCONST.POST_LIKED, HttpStatus.CREATED, true, null)
        } catch (error) {
            SendError(error.message)
        }
    }

    async getLikeAndComments(postId: string, user: User) {
        try {
            const likes = await this.postLikeModel.count({ where: { postId: postId } })
            const userLiked = await this.postLikeModel.findOne({
                where: {
                    postId,
                    likedById: user.id
                }
            });
            const res = {
                like: {
                    likes,
                    isLiked: !!userLiked
                }
            }
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, res)
        } catch (error) {
            SendError(error.message)
        }
    }

    async followUnfollowArtist(artistId: string, user: User) {
        try {
            if (artistId == user.id) {
                throw new ForbiddenException(STRINGCONST.FOLLOW_SELF)
            }
            const res = await this.followModel.findOne({
                where: { followingId: artistId, followerId: user.id }
            })
            if (!res) {
                await this.followModel.create({
                    followingId: artistId,
                    followerId: user.id
                })
                return responseSender(STRINGCONST.ARTIST_FOLLOWED, HttpStatus.CREATED, true, null)
            } else {
                await res.destroy()
                return responseSender(STRINGCONST.ARTIST_UNFOLLOWED, HttpStatus.OK, true, null)
            }
        } catch (error) {
            SendError(error.message)
        }
    }

}