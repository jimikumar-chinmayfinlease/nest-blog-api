import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostEntity} from './post.entity';
import { AuthGuard } from '@nestjs/passport';
import { PostDto } from './dto/post.dto';

@Controller('posts')
export class PostsController {
    constructor(
        private readonly postService: PostsService
    ) {}

    @Get()
    async findAll() {
        return await this.postService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<PostEntity> {
        const post = await this.postService.findOne(id);

        if(!post) {
            throw new NotFoundException('This Post doesn\'t exist');
        }

        return post;
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Body() post: PostDto, @Request() req): Promise<PostEntity> {
        return await this.postService.create(post, req.user.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(@Param('id') id: number, @Body() post: PostDto, @Request() req): Promise<PostEntity> {
        const { numberOfAffectedRows, updatedPost } = await this.postService.update(id, post, req.user.id);

        if(numberOfAffectedRows === 0) {
            throw new NotFoundException('This Post doesn\'t exist');
        }

        return updatedPost;
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async remove(@Param('id') id: number, @Request() req) {
        const deleted = await this.postService.delete(id, req.user.id);

        if(deleted === 0)  {
            throw new NotFoundException('This Post doesn\'t exist');
        }

        return 'Successfully deleted';
    }
}
