import {
  Args,
  Context,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Author } from '../models/author.model';
import { Post } from '../models/post.model';
import { AuthorsService } from '../services/authors.service';
import { PostsService } from '../services/posts.service';
import { UseGuards } from '@nestjs/common';
import {
  MerchantGuard,
  MerchantRole,
  MerchantRoles,
} from 'src/auth/merchant.guard';
import { CurrentUser } from 'src/auth/current-user.decorators';

@Resolver(() => Author)
@UseGuards(MerchantGuard)
export class Authors {
  constructor(
    private authorsService: AuthorsService,
    private postsService: PostsService,
  ) {}

  @Query(() => Author)
  @MerchantRoles(MerchantRole.Merchant)
  async findAuthorForMerchant(
    @CurrentUser() currentUser: number,
    @Args('continuationToken', { type: () => Int }) continuationToken: number,
  ) {
    const author = this.authorsService.findOneById(currentUser);
    const posts = this.postsService.findAll({
      authorId: currentUser,
      continuationToken,
    });

    return {
      ...author,
      posts,
    };
  }

  @ResolveField((_) => [Post], {
    name: 'posts',
    nullable: true,
  })
  async posts(
    @Parent() author: Author,
    @Args('continuationToken', { type: () => Int })
    continuationToken: number,
  ) {
    const { id } = author;

    return this.postsService.findAll({ authorId: id, continuationToken });
  }
}
