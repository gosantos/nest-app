import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Author } from './models/author.model';
import { Post } from './models/post.model';
import { AuthorsService } from './services/authors.service';
import { PostsService } from './services/posts.service';
import { BackofficeRole, BackofficeRoles } from 'src/auth/backoffice.guard';

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(
    private authorsService: AuthorsService,
    private postsService: PostsService,
  ) {}

  @Query(() => Author)
  @BackofficeRoles(BackofficeRole.Admin, BackofficeRole.User)
  async author(@Args('id', { type: () => Int }) id: number) {
    return this.authorsService.findOneById(id);
  }

  @Query(() => [Author])
  @BackofficeRoles(BackofficeRole.Admin)
  async authors() {
    return this.authorsService.findAll();
  }

  @Mutation(() => Author)
  @BackofficeRoles(BackofficeRole.Admin)
  async createAuthor(
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
  ) {
    return this.authorsService.create({ firstName, lastName });
  }

  @Query(() => Author)
  @BackofficeRoles(BackofficeRole.Admin)
  async findAllAuthorPosts(
    @Args('authorId', { type: () => Int }) authorId: number,
    @Args('continuationToken', { type: () => Int }) continuationToken: number,
  ) {
    const author = this.authorsService.findOneById(authorId);
    const posts = this.postsService.findAll({ authorId, continuationToken });

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
    @Args('continuationToken', { type: () => Int, nullable: true })
    continuationToken: number,
  ) {
    const { id } = author;

    return this.postsService.findAll({ authorId: id, continuationToken });
  }
}
