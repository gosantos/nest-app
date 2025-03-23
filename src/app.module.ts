import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthorsService } from './authors/services/authors.service';
import { PostsService } from './authors/services/posts.service';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { Authors as BackofficeAuthors } from './authors/backoffice/authors.resolver';
import { Authors as MerchantAuthors } from './authors/merchant/authors.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: true,
      sortSchema: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
  ],
  providers: [AuthorsService, PostsService, BackofficeAuthors, MerchantAuthors],
})
export class AppModule {}
