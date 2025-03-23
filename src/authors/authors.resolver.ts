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
import { AuthorsService } from './services/authors.service';
import { PostsService } from './services/posts.service';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(
    private authorsService: AuthorsService,
    private postsService: PostsService,
  ) {}

  @Query(() => Author)
  @Roles(Role.Admin, Role.User)
  async author(@Args('id', { type: () => Int }) id: number) {
    return this.authorsService.findOneById(id);
  }

  @Query(() => [Author])
  @Roles(Role.Admin)
  async authors() {
    return this.authorsService.findAll();
  }

  @Mutation(() => Author)
  @Roles(Role.Admin)
  async createAuthor(
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
  ) {
    return this.authorsService.create({ firstName, lastName });
  }

  @ResolveField()
  async posts(@Parent() author: Author) {
    const { id } = author;
    return this.postsService.findAll({ authorId: id });
  }
}
