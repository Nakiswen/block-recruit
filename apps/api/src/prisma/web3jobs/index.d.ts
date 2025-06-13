
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model job_posting
 * 职位发布表 - 存储从其他招聘网站爬取的职位信息
 */
export type job_posting = $Result.DefaultSelection<Prisma.$job_postingPayload>
/**
 * Model job_tag_relation
 * 职位标签关系表 - 存储职位与标签的多对多关系
 */
export type job_tag_relation = $Result.DefaultSelection<Prisma.$job_tag_relationPayload>
/**
 * Model tag
 * 标签表 - 存储职位相关的标签信息
 */
export type tag = $Result.DefaultSelection<Prisma.$tagPayload>
/**
 * Model user_info
 * 发布岗位信息的用户信息表 - 存储发布岗位信息的用户的基本信息
 */
export type user_info = $Result.DefaultSelection<Prisma.$user_infoPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Job_postings
 * const job_postings = await prisma.job_posting.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Job_postings
   * const job_postings = await prisma.job_posting.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.job_posting`: Exposes CRUD operations for the **job_posting** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Job_postings
    * const job_postings = await prisma.job_posting.findMany()
    * ```
    */
  get job_posting(): Prisma.job_postingDelegate<ExtArgs>;

  /**
   * `prisma.job_tag_relation`: Exposes CRUD operations for the **job_tag_relation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Job_tag_relations
    * const job_tag_relations = await prisma.job_tag_relation.findMany()
    * ```
    */
  get job_tag_relation(): Prisma.job_tag_relationDelegate<ExtArgs>;

  /**
   * `prisma.tag`: Exposes CRUD operations for the **tag** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tags
    * const tags = await prisma.tag.findMany()
    * ```
    */
  get tag(): Prisma.tagDelegate<ExtArgs>;

  /**
   * `prisma.user_info`: Exposes CRUD operations for the **user_info** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more User_infos
    * const user_infos = await prisma.user_info.findMany()
    * ```
    */
  get user_info(): Prisma.user_infoDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    job_posting: 'job_posting',
    job_tag_relation: 'job_tag_relation',
    tag: 'tag',
    user_info: 'user_info'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "job_posting" | "job_tag_relation" | "tag" | "user_info"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      job_posting: {
        payload: Prisma.$job_postingPayload<ExtArgs>
        fields: Prisma.job_postingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.job_postingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_postingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.job_postingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_postingPayload>
          }
          findFirst: {
            args: Prisma.job_postingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_postingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.job_postingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_postingPayload>
          }
          findMany: {
            args: Prisma.job_postingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_postingPayload>[]
          }
          create: {
            args: Prisma.job_postingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_postingPayload>
          }
          createMany: {
            args: Prisma.job_postingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.job_postingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_postingPayload>[]
          }
          delete: {
            args: Prisma.job_postingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_postingPayload>
          }
          update: {
            args: Prisma.job_postingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_postingPayload>
          }
          deleteMany: {
            args: Prisma.job_postingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.job_postingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.job_postingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_postingPayload>
          }
          aggregate: {
            args: Prisma.Job_postingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJob_posting>
          }
          groupBy: {
            args: Prisma.job_postingGroupByArgs<ExtArgs>
            result: $Utils.Optional<Job_postingGroupByOutputType>[]
          }
          count: {
            args: Prisma.job_postingCountArgs<ExtArgs>
            result: $Utils.Optional<Job_postingCountAggregateOutputType> | number
          }
        }
      }
      job_tag_relation: {
        payload: Prisma.$job_tag_relationPayload<ExtArgs>
        fields: Prisma.job_tag_relationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.job_tag_relationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_tag_relationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.job_tag_relationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_tag_relationPayload>
          }
          findFirst: {
            args: Prisma.job_tag_relationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_tag_relationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.job_tag_relationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_tag_relationPayload>
          }
          findMany: {
            args: Prisma.job_tag_relationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_tag_relationPayload>[]
          }
          create: {
            args: Prisma.job_tag_relationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_tag_relationPayload>
          }
          createMany: {
            args: Prisma.job_tag_relationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.job_tag_relationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_tag_relationPayload>[]
          }
          delete: {
            args: Prisma.job_tag_relationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_tag_relationPayload>
          }
          update: {
            args: Prisma.job_tag_relationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_tag_relationPayload>
          }
          deleteMany: {
            args: Prisma.job_tag_relationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.job_tag_relationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.job_tag_relationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_tag_relationPayload>
          }
          aggregate: {
            args: Prisma.Job_tag_relationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJob_tag_relation>
          }
          groupBy: {
            args: Prisma.job_tag_relationGroupByArgs<ExtArgs>
            result: $Utils.Optional<Job_tag_relationGroupByOutputType>[]
          }
          count: {
            args: Prisma.job_tag_relationCountArgs<ExtArgs>
            result: $Utils.Optional<Job_tag_relationCountAggregateOutputType> | number
          }
        }
      }
      tag: {
        payload: Prisma.$tagPayload<ExtArgs>
        fields: Prisma.tagFieldRefs
        operations: {
          findUnique: {
            args: Prisma.tagFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tagPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.tagFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tagPayload>
          }
          findFirst: {
            args: Prisma.tagFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tagPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.tagFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tagPayload>
          }
          findMany: {
            args: Prisma.tagFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tagPayload>[]
          }
          create: {
            args: Prisma.tagCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tagPayload>
          }
          createMany: {
            args: Prisma.tagCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.tagCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tagPayload>[]
          }
          delete: {
            args: Prisma.tagDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tagPayload>
          }
          update: {
            args: Prisma.tagUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tagPayload>
          }
          deleteMany: {
            args: Prisma.tagDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.tagUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.tagUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tagPayload>
          }
          aggregate: {
            args: Prisma.TagAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTag>
          }
          groupBy: {
            args: Prisma.tagGroupByArgs<ExtArgs>
            result: $Utils.Optional<TagGroupByOutputType>[]
          }
          count: {
            args: Prisma.tagCountArgs<ExtArgs>
            result: $Utils.Optional<TagCountAggregateOutputType> | number
          }
        }
      }
      user_info: {
        payload: Prisma.$user_infoPayload<ExtArgs>
        fields: Prisma.user_infoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.user_infoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_infoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.user_infoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_infoPayload>
          }
          findFirst: {
            args: Prisma.user_infoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_infoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.user_infoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_infoPayload>
          }
          findMany: {
            args: Prisma.user_infoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_infoPayload>[]
          }
          create: {
            args: Prisma.user_infoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_infoPayload>
          }
          createMany: {
            args: Prisma.user_infoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.user_infoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_infoPayload>[]
          }
          delete: {
            args: Prisma.user_infoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_infoPayload>
          }
          update: {
            args: Prisma.user_infoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_infoPayload>
          }
          deleteMany: {
            args: Prisma.user_infoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.user_infoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.user_infoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$user_infoPayload>
          }
          aggregate: {
            args: Prisma.User_infoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser_info>
          }
          groupBy: {
            args: Prisma.user_infoGroupByArgs<ExtArgs>
            result: $Utils.Optional<User_infoGroupByOutputType>[]
          }
          count: {
            args: Prisma.user_infoCountArgs<ExtArgs>
            result: $Utils.Optional<User_infoCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model job_posting
   */

  export type AggregateJob_posting = {
    _count: Job_postingCountAggregateOutputType | null
    _avg: Job_postingAvgAggregateOutputType | null
    _sum: Job_postingSumAggregateOutputType | null
    _min: Job_postingMinAggregateOutputType | null
    _max: Job_postingMaxAggregateOutputType | null
  }

  export type Job_postingAvgAggregateOutputType = {
    topic_id: number | null
    position_id: number | null
    view_count: number | null
    apply_count: number | null
    create_time: number | null
    work_type_id: number | null
    office_mode_id: number | null
    company_id: number | null
    min_salary: Decimal | null
    max_salary: Decimal | null
    lever_id: number | null
    status: number | null
  }

  export type Job_postingSumAggregateOutputType = {
    topic_id: bigint | null
    position_id: bigint | null
    view_count: number | null
    apply_count: number | null
    create_time: bigint | null
    work_type_id: number | null
    office_mode_id: number | null
    company_id: bigint | null
    min_salary: Decimal | null
    max_salary: Decimal | null
    lever_id: number | null
    status: number | null
  }

  export type Job_postingMinAggregateOutputType = {
    topic_id: bigint | null
    content: string | null
    content2: string | null
    content3: string | null
    content5: string | null
    email: string | null
    phone: string | null
    wechat: string | null
    telegram: string | null
    position_name: string | null
    position_id: bigint | null
    view_count: number | null
    applied: boolean | null
    apply_count: number | null
    create_time: bigint | null
    url: string | null
    work_type_id: number | null
    work_type_name: string | null
    office_mode_id: number | null
    office_mode_name: string | null
    company: string | null
    company_introduction: string | null
    company_size_name: string | null
    company_logo: string | null
    company_website: string | null
    company_id: bigint | null
    min_salary: Decimal | null
    max_salary: Decimal | null
    lever_id: number | null
    lever_name: string | null
    location: string | null
    base: string | null
    ffrom: string | null
    status: number | null
  }

  export type Job_postingMaxAggregateOutputType = {
    topic_id: bigint | null
    content: string | null
    content2: string | null
    content3: string | null
    content5: string | null
    email: string | null
    phone: string | null
    wechat: string | null
    telegram: string | null
    position_name: string | null
    position_id: bigint | null
    view_count: number | null
    applied: boolean | null
    apply_count: number | null
    create_time: bigint | null
    url: string | null
    work_type_id: number | null
    work_type_name: string | null
    office_mode_id: number | null
    office_mode_name: string | null
    company: string | null
    company_introduction: string | null
    company_size_name: string | null
    company_logo: string | null
    company_website: string | null
    company_id: bigint | null
    min_salary: Decimal | null
    max_salary: Decimal | null
    lever_id: number | null
    lever_name: string | null
    location: string | null
    base: string | null
    ffrom: string | null
    status: number | null
  }

  export type Job_postingCountAggregateOutputType = {
    topic_id: number
    content: number
    content2: number
    content3: number
    content5: number
    email: number
    phone: number
    wechat: number
    telegram: number
    position_name: number
    position_id: number
    view_count: number
    applied: number
    apply_count: number
    create_time: number
    url: number
    work_type_id: number
    work_type_name: number
    office_mode_id: number
    office_mode_name: number
    company: number
    company_introduction: number
    company_size_name: number
    company_logo: number
    company_website: number
    company_id: number
    min_salary: number
    max_salary: number
    lever_id: number
    lever_name: number
    location: number
    base: number
    ffrom: number
    status: number
    _all: number
  }


  export type Job_postingAvgAggregateInputType = {
    topic_id?: true
    position_id?: true
    view_count?: true
    apply_count?: true
    create_time?: true
    work_type_id?: true
    office_mode_id?: true
    company_id?: true
    min_salary?: true
    max_salary?: true
    lever_id?: true
    status?: true
  }

  export type Job_postingSumAggregateInputType = {
    topic_id?: true
    position_id?: true
    view_count?: true
    apply_count?: true
    create_time?: true
    work_type_id?: true
    office_mode_id?: true
    company_id?: true
    min_salary?: true
    max_salary?: true
    lever_id?: true
    status?: true
  }

  export type Job_postingMinAggregateInputType = {
    topic_id?: true
    content?: true
    content2?: true
    content3?: true
    content5?: true
    email?: true
    phone?: true
    wechat?: true
    telegram?: true
    position_name?: true
    position_id?: true
    view_count?: true
    applied?: true
    apply_count?: true
    create_time?: true
    url?: true
    work_type_id?: true
    work_type_name?: true
    office_mode_id?: true
    office_mode_name?: true
    company?: true
    company_introduction?: true
    company_size_name?: true
    company_logo?: true
    company_website?: true
    company_id?: true
    min_salary?: true
    max_salary?: true
    lever_id?: true
    lever_name?: true
    location?: true
    base?: true
    ffrom?: true
    status?: true
  }

  export type Job_postingMaxAggregateInputType = {
    topic_id?: true
    content?: true
    content2?: true
    content3?: true
    content5?: true
    email?: true
    phone?: true
    wechat?: true
    telegram?: true
    position_name?: true
    position_id?: true
    view_count?: true
    applied?: true
    apply_count?: true
    create_time?: true
    url?: true
    work_type_id?: true
    work_type_name?: true
    office_mode_id?: true
    office_mode_name?: true
    company?: true
    company_introduction?: true
    company_size_name?: true
    company_logo?: true
    company_website?: true
    company_id?: true
    min_salary?: true
    max_salary?: true
    lever_id?: true
    lever_name?: true
    location?: true
    base?: true
    ffrom?: true
    status?: true
  }

  export type Job_postingCountAggregateInputType = {
    topic_id?: true
    content?: true
    content2?: true
    content3?: true
    content5?: true
    email?: true
    phone?: true
    wechat?: true
    telegram?: true
    position_name?: true
    position_id?: true
    view_count?: true
    applied?: true
    apply_count?: true
    create_time?: true
    url?: true
    work_type_id?: true
    work_type_name?: true
    office_mode_id?: true
    office_mode_name?: true
    company?: true
    company_introduction?: true
    company_size_name?: true
    company_logo?: true
    company_website?: true
    company_id?: true
    min_salary?: true
    max_salary?: true
    lever_id?: true
    lever_name?: true
    location?: true
    base?: true
    ffrom?: true
    status?: true
    _all?: true
  }

  export type Job_postingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which job_posting to aggregate.
     */
    where?: job_postingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of job_postings to fetch.
     */
    orderBy?: job_postingOrderByWithRelationInput | job_postingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: job_postingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` job_postings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` job_postings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned job_postings
    **/
    _count?: true | Job_postingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Job_postingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Job_postingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Job_postingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Job_postingMaxAggregateInputType
  }

  export type GetJob_postingAggregateType<T extends Job_postingAggregateArgs> = {
        [P in keyof T & keyof AggregateJob_posting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJob_posting[P]>
      : GetScalarType<T[P], AggregateJob_posting[P]>
  }




  export type job_postingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: job_postingWhereInput
    orderBy?: job_postingOrderByWithAggregationInput | job_postingOrderByWithAggregationInput[]
    by: Job_postingScalarFieldEnum[] | Job_postingScalarFieldEnum
    having?: job_postingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Job_postingCountAggregateInputType | true
    _avg?: Job_postingAvgAggregateInputType
    _sum?: Job_postingSumAggregateInputType
    _min?: Job_postingMinAggregateInputType
    _max?: Job_postingMaxAggregateInputType
  }

  export type Job_postingGroupByOutputType = {
    topic_id: bigint
    content: string | null
    content2: string | null
    content3: string | null
    content5: string | null
    email: string | null
    phone: string | null
    wechat: string | null
    telegram: string | null
    position_name: string
    position_id: bigint | null
    view_count: number | null
    applied: boolean | null
    apply_count: number | null
    create_time: bigint | null
    url: string | null
    work_type_id: number | null
    work_type_name: string | null
    office_mode_id: number | null
    office_mode_name: string | null
    company: string
    company_introduction: string | null
    company_size_name: string | null
    company_logo: string | null
    company_website: string | null
    company_id: bigint | null
    min_salary: Decimal | null
    max_salary: Decimal | null
    lever_id: number | null
    lever_name: string | null
    location: string | null
    base: string | null
    ffrom: string | null
    status: number | null
    _count: Job_postingCountAggregateOutputType | null
    _avg: Job_postingAvgAggregateOutputType | null
    _sum: Job_postingSumAggregateOutputType | null
    _min: Job_postingMinAggregateOutputType | null
    _max: Job_postingMaxAggregateOutputType | null
  }

  type GetJob_postingGroupByPayload<T extends job_postingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Job_postingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Job_postingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Job_postingGroupByOutputType[P]>
            : GetScalarType<T[P], Job_postingGroupByOutputType[P]>
        }
      >
    >


  export type job_postingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    topic_id?: boolean
    content?: boolean
    content2?: boolean
    content3?: boolean
    content5?: boolean
    email?: boolean
    phone?: boolean
    wechat?: boolean
    telegram?: boolean
    position_name?: boolean
    position_id?: boolean
    view_count?: boolean
    applied?: boolean
    apply_count?: boolean
    create_time?: boolean
    url?: boolean
    work_type_id?: boolean
    work_type_name?: boolean
    office_mode_id?: boolean
    office_mode_name?: boolean
    company?: boolean
    company_introduction?: boolean
    company_size_name?: boolean
    company_logo?: boolean
    company_website?: boolean
    company_id?: boolean
    min_salary?: boolean
    max_salary?: boolean
    lever_id?: boolean
    lever_name?: boolean
    location?: boolean
    base?: boolean
    ffrom?: boolean
    status?: boolean
  }, ExtArgs["result"]["job_posting"]>

  export type job_postingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    topic_id?: boolean
    content?: boolean
    content2?: boolean
    content3?: boolean
    content5?: boolean
    email?: boolean
    phone?: boolean
    wechat?: boolean
    telegram?: boolean
    position_name?: boolean
    position_id?: boolean
    view_count?: boolean
    applied?: boolean
    apply_count?: boolean
    create_time?: boolean
    url?: boolean
    work_type_id?: boolean
    work_type_name?: boolean
    office_mode_id?: boolean
    office_mode_name?: boolean
    company?: boolean
    company_introduction?: boolean
    company_size_name?: boolean
    company_logo?: boolean
    company_website?: boolean
    company_id?: boolean
    min_salary?: boolean
    max_salary?: boolean
    lever_id?: boolean
    lever_name?: boolean
    location?: boolean
    base?: boolean
    ffrom?: boolean
    status?: boolean
  }, ExtArgs["result"]["job_posting"]>

  export type job_postingSelectScalar = {
    topic_id?: boolean
    content?: boolean
    content2?: boolean
    content3?: boolean
    content5?: boolean
    email?: boolean
    phone?: boolean
    wechat?: boolean
    telegram?: boolean
    position_name?: boolean
    position_id?: boolean
    view_count?: boolean
    applied?: boolean
    apply_count?: boolean
    create_time?: boolean
    url?: boolean
    work_type_id?: boolean
    work_type_name?: boolean
    office_mode_id?: boolean
    office_mode_name?: boolean
    company?: boolean
    company_introduction?: boolean
    company_size_name?: boolean
    company_logo?: boolean
    company_website?: boolean
    company_id?: boolean
    min_salary?: boolean
    max_salary?: boolean
    lever_id?: boolean
    lever_name?: boolean
    location?: boolean
    base?: boolean
    ffrom?: boolean
    status?: boolean
  }


  export type $job_postingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "job_posting"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      topic_id: bigint
      content: string | null
      content2: string | null
      content3: string | null
      content5: string | null
      email: string | null
      phone: string | null
      wechat: string | null
      telegram: string | null
      position_name: string
      position_id: bigint | null
      view_count: number | null
      applied: boolean | null
      apply_count: number | null
      create_time: bigint | null
      url: string | null
      work_type_id: number | null
      work_type_name: string | null
      office_mode_id: number | null
      office_mode_name: string | null
      company: string
      company_introduction: string | null
      company_size_name: string | null
      company_logo: string | null
      company_website: string | null
      company_id: bigint | null
      min_salary: Prisma.Decimal | null
      max_salary: Prisma.Decimal | null
      lever_id: number | null
      lever_name: string | null
      location: string | null
      base: string | null
      ffrom: string | null
      status: number | null
    }, ExtArgs["result"]["job_posting"]>
    composites: {}
  }

  type job_postingGetPayload<S extends boolean | null | undefined | job_postingDefaultArgs> = $Result.GetResult<Prisma.$job_postingPayload, S>

  type job_postingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<job_postingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: Job_postingCountAggregateInputType | true
    }

  export interface job_postingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['job_posting'], meta: { name: 'job_posting' } }
    /**
     * Find zero or one Job_posting that matches the filter.
     * @param {job_postingFindUniqueArgs} args - Arguments to find a Job_posting
     * @example
     * // Get one Job_posting
     * const job_posting = await prisma.job_posting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends job_postingFindUniqueArgs>(args: SelectSubset<T, job_postingFindUniqueArgs<ExtArgs>>): Prisma__job_postingClient<$Result.GetResult<Prisma.$job_postingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Job_posting that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {job_postingFindUniqueOrThrowArgs} args - Arguments to find a Job_posting
     * @example
     * // Get one Job_posting
     * const job_posting = await prisma.job_posting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends job_postingFindUniqueOrThrowArgs>(args: SelectSubset<T, job_postingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__job_postingClient<$Result.GetResult<Prisma.$job_postingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Job_posting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {job_postingFindFirstArgs} args - Arguments to find a Job_posting
     * @example
     * // Get one Job_posting
     * const job_posting = await prisma.job_posting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends job_postingFindFirstArgs>(args?: SelectSubset<T, job_postingFindFirstArgs<ExtArgs>>): Prisma__job_postingClient<$Result.GetResult<Prisma.$job_postingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Job_posting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {job_postingFindFirstOrThrowArgs} args - Arguments to find a Job_posting
     * @example
     * // Get one Job_posting
     * const job_posting = await prisma.job_posting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends job_postingFindFirstOrThrowArgs>(args?: SelectSubset<T, job_postingFindFirstOrThrowArgs<ExtArgs>>): Prisma__job_postingClient<$Result.GetResult<Prisma.$job_postingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Job_postings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {job_postingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Job_postings
     * const job_postings = await prisma.job_posting.findMany()
     * 
     * // Get first 10 Job_postings
     * const job_postings = await prisma.job_posting.findMany({ take: 10 })
     * 
     * // Only select the `topic_id`
     * const job_postingWithTopic_idOnly = await prisma.job_posting.findMany({ select: { topic_id: true } })
     * 
     */
    findMany<T extends job_postingFindManyArgs>(args?: SelectSubset<T, job_postingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$job_postingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Job_posting.
     * @param {job_postingCreateArgs} args - Arguments to create a Job_posting.
     * @example
     * // Create one Job_posting
     * const Job_posting = await prisma.job_posting.create({
     *   data: {
     *     // ... data to create a Job_posting
     *   }
     * })
     * 
     */
    create<T extends job_postingCreateArgs>(args: SelectSubset<T, job_postingCreateArgs<ExtArgs>>): Prisma__job_postingClient<$Result.GetResult<Prisma.$job_postingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Job_postings.
     * @param {job_postingCreateManyArgs} args - Arguments to create many Job_postings.
     * @example
     * // Create many Job_postings
     * const job_posting = await prisma.job_posting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends job_postingCreateManyArgs>(args?: SelectSubset<T, job_postingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Job_postings and returns the data saved in the database.
     * @param {job_postingCreateManyAndReturnArgs} args - Arguments to create many Job_postings.
     * @example
     * // Create many Job_postings
     * const job_posting = await prisma.job_posting.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Job_postings and only return the `topic_id`
     * const job_postingWithTopic_idOnly = await prisma.job_posting.createManyAndReturn({ 
     *   select: { topic_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends job_postingCreateManyAndReturnArgs>(args?: SelectSubset<T, job_postingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$job_postingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Job_posting.
     * @param {job_postingDeleteArgs} args - Arguments to delete one Job_posting.
     * @example
     * // Delete one Job_posting
     * const Job_posting = await prisma.job_posting.delete({
     *   where: {
     *     // ... filter to delete one Job_posting
     *   }
     * })
     * 
     */
    delete<T extends job_postingDeleteArgs>(args: SelectSubset<T, job_postingDeleteArgs<ExtArgs>>): Prisma__job_postingClient<$Result.GetResult<Prisma.$job_postingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Job_posting.
     * @param {job_postingUpdateArgs} args - Arguments to update one Job_posting.
     * @example
     * // Update one Job_posting
     * const job_posting = await prisma.job_posting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends job_postingUpdateArgs>(args: SelectSubset<T, job_postingUpdateArgs<ExtArgs>>): Prisma__job_postingClient<$Result.GetResult<Prisma.$job_postingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Job_postings.
     * @param {job_postingDeleteManyArgs} args - Arguments to filter Job_postings to delete.
     * @example
     * // Delete a few Job_postings
     * const { count } = await prisma.job_posting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends job_postingDeleteManyArgs>(args?: SelectSubset<T, job_postingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Job_postings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {job_postingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Job_postings
     * const job_posting = await prisma.job_posting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends job_postingUpdateManyArgs>(args: SelectSubset<T, job_postingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Job_posting.
     * @param {job_postingUpsertArgs} args - Arguments to update or create a Job_posting.
     * @example
     * // Update or create a Job_posting
     * const job_posting = await prisma.job_posting.upsert({
     *   create: {
     *     // ... data to create a Job_posting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Job_posting we want to update
     *   }
     * })
     */
    upsert<T extends job_postingUpsertArgs>(args: SelectSubset<T, job_postingUpsertArgs<ExtArgs>>): Prisma__job_postingClient<$Result.GetResult<Prisma.$job_postingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Job_postings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {job_postingCountArgs} args - Arguments to filter Job_postings to count.
     * @example
     * // Count the number of Job_postings
     * const count = await prisma.job_posting.count({
     *   where: {
     *     // ... the filter for the Job_postings we want to count
     *   }
     * })
    **/
    count<T extends job_postingCountArgs>(
      args?: Subset<T, job_postingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Job_postingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Job_posting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Job_postingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Job_postingAggregateArgs>(args: Subset<T, Job_postingAggregateArgs>): Prisma.PrismaPromise<GetJob_postingAggregateType<T>>

    /**
     * Group by Job_posting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {job_postingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends job_postingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: job_postingGroupByArgs['orderBy'] }
        : { orderBy?: job_postingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, job_postingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJob_postingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the job_posting model
   */
  readonly fields: job_postingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for job_posting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__job_postingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the job_posting model
   */ 
  interface job_postingFieldRefs {
    readonly topic_id: FieldRef<"job_posting", 'BigInt'>
    readonly content: FieldRef<"job_posting", 'String'>
    readonly content2: FieldRef<"job_posting", 'String'>
    readonly content3: FieldRef<"job_posting", 'String'>
    readonly content5: FieldRef<"job_posting", 'String'>
    readonly email: FieldRef<"job_posting", 'String'>
    readonly phone: FieldRef<"job_posting", 'String'>
    readonly wechat: FieldRef<"job_posting", 'String'>
    readonly telegram: FieldRef<"job_posting", 'String'>
    readonly position_name: FieldRef<"job_posting", 'String'>
    readonly position_id: FieldRef<"job_posting", 'BigInt'>
    readonly view_count: FieldRef<"job_posting", 'Int'>
    readonly applied: FieldRef<"job_posting", 'Boolean'>
    readonly apply_count: FieldRef<"job_posting", 'Int'>
    readonly create_time: FieldRef<"job_posting", 'BigInt'>
    readonly url: FieldRef<"job_posting", 'String'>
    readonly work_type_id: FieldRef<"job_posting", 'Int'>
    readonly work_type_name: FieldRef<"job_posting", 'String'>
    readonly office_mode_id: FieldRef<"job_posting", 'Int'>
    readonly office_mode_name: FieldRef<"job_posting", 'String'>
    readonly company: FieldRef<"job_posting", 'String'>
    readonly company_introduction: FieldRef<"job_posting", 'String'>
    readonly company_size_name: FieldRef<"job_posting", 'String'>
    readonly company_logo: FieldRef<"job_posting", 'String'>
    readonly company_website: FieldRef<"job_posting", 'String'>
    readonly company_id: FieldRef<"job_posting", 'BigInt'>
    readonly min_salary: FieldRef<"job_posting", 'Decimal'>
    readonly max_salary: FieldRef<"job_posting", 'Decimal'>
    readonly lever_id: FieldRef<"job_posting", 'Int'>
    readonly lever_name: FieldRef<"job_posting", 'String'>
    readonly location: FieldRef<"job_posting", 'String'>
    readonly base: FieldRef<"job_posting", 'String'>
    readonly ffrom: FieldRef<"job_posting", 'String'>
    readonly status: FieldRef<"job_posting", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * job_posting findUnique
   */
  export type job_postingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_posting
     */
    select?: job_postingSelect<ExtArgs> | null
    /**
     * Filter, which job_posting to fetch.
     */
    where: job_postingWhereUniqueInput
  }

  /**
   * job_posting findUniqueOrThrow
   */
  export type job_postingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_posting
     */
    select?: job_postingSelect<ExtArgs> | null
    /**
     * Filter, which job_posting to fetch.
     */
    where: job_postingWhereUniqueInput
  }

  /**
   * job_posting findFirst
   */
  export type job_postingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_posting
     */
    select?: job_postingSelect<ExtArgs> | null
    /**
     * Filter, which job_posting to fetch.
     */
    where?: job_postingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of job_postings to fetch.
     */
    orderBy?: job_postingOrderByWithRelationInput | job_postingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for job_postings.
     */
    cursor?: job_postingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` job_postings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` job_postings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of job_postings.
     */
    distinct?: Job_postingScalarFieldEnum | Job_postingScalarFieldEnum[]
  }

  /**
   * job_posting findFirstOrThrow
   */
  export type job_postingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_posting
     */
    select?: job_postingSelect<ExtArgs> | null
    /**
     * Filter, which job_posting to fetch.
     */
    where?: job_postingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of job_postings to fetch.
     */
    orderBy?: job_postingOrderByWithRelationInput | job_postingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for job_postings.
     */
    cursor?: job_postingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` job_postings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` job_postings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of job_postings.
     */
    distinct?: Job_postingScalarFieldEnum | Job_postingScalarFieldEnum[]
  }

  /**
   * job_posting findMany
   */
  export type job_postingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_posting
     */
    select?: job_postingSelect<ExtArgs> | null
    /**
     * Filter, which job_postings to fetch.
     */
    where?: job_postingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of job_postings to fetch.
     */
    orderBy?: job_postingOrderByWithRelationInput | job_postingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing job_postings.
     */
    cursor?: job_postingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` job_postings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` job_postings.
     */
    skip?: number
    distinct?: Job_postingScalarFieldEnum | Job_postingScalarFieldEnum[]
  }

  /**
   * job_posting create
   */
  export type job_postingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_posting
     */
    select?: job_postingSelect<ExtArgs> | null
    /**
     * The data needed to create a job_posting.
     */
    data: XOR<job_postingCreateInput, job_postingUncheckedCreateInput>
  }

  /**
   * job_posting createMany
   */
  export type job_postingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many job_postings.
     */
    data: job_postingCreateManyInput | job_postingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * job_posting createManyAndReturn
   */
  export type job_postingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_posting
     */
    select?: job_postingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many job_postings.
     */
    data: job_postingCreateManyInput | job_postingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * job_posting update
   */
  export type job_postingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_posting
     */
    select?: job_postingSelect<ExtArgs> | null
    /**
     * The data needed to update a job_posting.
     */
    data: XOR<job_postingUpdateInput, job_postingUncheckedUpdateInput>
    /**
     * Choose, which job_posting to update.
     */
    where: job_postingWhereUniqueInput
  }

  /**
   * job_posting updateMany
   */
  export type job_postingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update job_postings.
     */
    data: XOR<job_postingUpdateManyMutationInput, job_postingUncheckedUpdateManyInput>
    /**
     * Filter which job_postings to update
     */
    where?: job_postingWhereInput
  }

  /**
   * job_posting upsert
   */
  export type job_postingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_posting
     */
    select?: job_postingSelect<ExtArgs> | null
    /**
     * The filter to search for the job_posting to update in case it exists.
     */
    where: job_postingWhereUniqueInput
    /**
     * In case the job_posting found by the `where` argument doesn't exist, create a new job_posting with this data.
     */
    create: XOR<job_postingCreateInput, job_postingUncheckedCreateInput>
    /**
     * In case the job_posting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<job_postingUpdateInput, job_postingUncheckedUpdateInput>
  }

  /**
   * job_posting delete
   */
  export type job_postingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_posting
     */
    select?: job_postingSelect<ExtArgs> | null
    /**
     * Filter which job_posting to delete.
     */
    where: job_postingWhereUniqueInput
  }

  /**
   * job_posting deleteMany
   */
  export type job_postingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which job_postings to delete
     */
    where?: job_postingWhereInput
  }

  /**
   * job_posting without action
   */
  export type job_postingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_posting
     */
    select?: job_postingSelect<ExtArgs> | null
  }


  /**
   * Model job_tag_relation
   */

  export type AggregateJob_tag_relation = {
    _count: Job_tag_relationCountAggregateOutputType | null
    _avg: Job_tag_relationAvgAggregateOutputType | null
    _sum: Job_tag_relationSumAggregateOutputType | null
    _min: Job_tag_relationMinAggregateOutputType | null
    _max: Job_tag_relationMaxAggregateOutputType | null
  }

  export type Job_tag_relationAvgAggregateOutputType = {
    topic_id: number | null
    tag_id: number | null
  }

  export type Job_tag_relationSumAggregateOutputType = {
    topic_id: bigint | null
    tag_id: bigint | null
  }

  export type Job_tag_relationMinAggregateOutputType = {
    topic_id: bigint | null
    tag_id: bigint | null
    ffrom: string | null
  }

  export type Job_tag_relationMaxAggregateOutputType = {
    topic_id: bigint | null
    tag_id: bigint | null
    ffrom: string | null
  }

  export type Job_tag_relationCountAggregateOutputType = {
    topic_id: number
    tag_id: number
    ffrom: number
    _all: number
  }


  export type Job_tag_relationAvgAggregateInputType = {
    topic_id?: true
    tag_id?: true
  }

  export type Job_tag_relationSumAggregateInputType = {
    topic_id?: true
    tag_id?: true
  }

  export type Job_tag_relationMinAggregateInputType = {
    topic_id?: true
    tag_id?: true
    ffrom?: true
  }

  export type Job_tag_relationMaxAggregateInputType = {
    topic_id?: true
    tag_id?: true
    ffrom?: true
  }

  export type Job_tag_relationCountAggregateInputType = {
    topic_id?: true
    tag_id?: true
    ffrom?: true
    _all?: true
  }

  export type Job_tag_relationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which job_tag_relation to aggregate.
     */
    where?: job_tag_relationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of job_tag_relations to fetch.
     */
    orderBy?: job_tag_relationOrderByWithRelationInput | job_tag_relationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: job_tag_relationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` job_tag_relations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` job_tag_relations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned job_tag_relations
    **/
    _count?: true | Job_tag_relationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Job_tag_relationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Job_tag_relationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Job_tag_relationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Job_tag_relationMaxAggregateInputType
  }

  export type GetJob_tag_relationAggregateType<T extends Job_tag_relationAggregateArgs> = {
        [P in keyof T & keyof AggregateJob_tag_relation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJob_tag_relation[P]>
      : GetScalarType<T[P], AggregateJob_tag_relation[P]>
  }




  export type job_tag_relationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: job_tag_relationWhereInput
    orderBy?: job_tag_relationOrderByWithAggregationInput | job_tag_relationOrderByWithAggregationInput[]
    by: Job_tag_relationScalarFieldEnum[] | Job_tag_relationScalarFieldEnum
    having?: job_tag_relationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Job_tag_relationCountAggregateInputType | true
    _avg?: Job_tag_relationAvgAggregateInputType
    _sum?: Job_tag_relationSumAggregateInputType
    _min?: Job_tag_relationMinAggregateInputType
    _max?: Job_tag_relationMaxAggregateInputType
  }

  export type Job_tag_relationGroupByOutputType = {
    topic_id: bigint
    tag_id: bigint
    ffrom: string | null
    _count: Job_tag_relationCountAggregateOutputType | null
    _avg: Job_tag_relationAvgAggregateOutputType | null
    _sum: Job_tag_relationSumAggregateOutputType | null
    _min: Job_tag_relationMinAggregateOutputType | null
    _max: Job_tag_relationMaxAggregateOutputType | null
  }

  type GetJob_tag_relationGroupByPayload<T extends job_tag_relationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Job_tag_relationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Job_tag_relationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Job_tag_relationGroupByOutputType[P]>
            : GetScalarType<T[P], Job_tag_relationGroupByOutputType[P]>
        }
      >
    >


  export type job_tag_relationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    topic_id?: boolean
    tag_id?: boolean
    ffrom?: boolean
  }, ExtArgs["result"]["job_tag_relation"]>

  export type job_tag_relationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    topic_id?: boolean
    tag_id?: boolean
    ffrom?: boolean
  }, ExtArgs["result"]["job_tag_relation"]>

  export type job_tag_relationSelectScalar = {
    topic_id?: boolean
    tag_id?: boolean
    ffrom?: boolean
  }


  export type $job_tag_relationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "job_tag_relation"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      topic_id: bigint
      tag_id: bigint
      ffrom: string | null
    }, ExtArgs["result"]["job_tag_relation"]>
    composites: {}
  }

  type job_tag_relationGetPayload<S extends boolean | null | undefined | job_tag_relationDefaultArgs> = $Result.GetResult<Prisma.$job_tag_relationPayload, S>

  type job_tag_relationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<job_tag_relationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: Job_tag_relationCountAggregateInputType | true
    }

  export interface job_tag_relationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['job_tag_relation'], meta: { name: 'job_tag_relation' } }
    /**
     * Find zero or one Job_tag_relation that matches the filter.
     * @param {job_tag_relationFindUniqueArgs} args - Arguments to find a Job_tag_relation
     * @example
     * // Get one Job_tag_relation
     * const job_tag_relation = await prisma.job_tag_relation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends job_tag_relationFindUniqueArgs>(args: SelectSubset<T, job_tag_relationFindUniqueArgs<ExtArgs>>): Prisma__job_tag_relationClient<$Result.GetResult<Prisma.$job_tag_relationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Job_tag_relation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {job_tag_relationFindUniqueOrThrowArgs} args - Arguments to find a Job_tag_relation
     * @example
     * // Get one Job_tag_relation
     * const job_tag_relation = await prisma.job_tag_relation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends job_tag_relationFindUniqueOrThrowArgs>(args: SelectSubset<T, job_tag_relationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__job_tag_relationClient<$Result.GetResult<Prisma.$job_tag_relationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Job_tag_relation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {job_tag_relationFindFirstArgs} args - Arguments to find a Job_tag_relation
     * @example
     * // Get one Job_tag_relation
     * const job_tag_relation = await prisma.job_tag_relation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends job_tag_relationFindFirstArgs>(args?: SelectSubset<T, job_tag_relationFindFirstArgs<ExtArgs>>): Prisma__job_tag_relationClient<$Result.GetResult<Prisma.$job_tag_relationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Job_tag_relation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {job_tag_relationFindFirstOrThrowArgs} args - Arguments to find a Job_tag_relation
     * @example
     * // Get one Job_tag_relation
     * const job_tag_relation = await prisma.job_tag_relation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends job_tag_relationFindFirstOrThrowArgs>(args?: SelectSubset<T, job_tag_relationFindFirstOrThrowArgs<ExtArgs>>): Prisma__job_tag_relationClient<$Result.GetResult<Prisma.$job_tag_relationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Job_tag_relations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {job_tag_relationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Job_tag_relations
     * const job_tag_relations = await prisma.job_tag_relation.findMany()
     * 
     * // Get first 10 Job_tag_relations
     * const job_tag_relations = await prisma.job_tag_relation.findMany({ take: 10 })
     * 
     * // Only select the `topic_id`
     * const job_tag_relationWithTopic_idOnly = await prisma.job_tag_relation.findMany({ select: { topic_id: true } })
     * 
     */
    findMany<T extends job_tag_relationFindManyArgs>(args?: SelectSubset<T, job_tag_relationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$job_tag_relationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Job_tag_relation.
     * @param {job_tag_relationCreateArgs} args - Arguments to create a Job_tag_relation.
     * @example
     * // Create one Job_tag_relation
     * const Job_tag_relation = await prisma.job_tag_relation.create({
     *   data: {
     *     // ... data to create a Job_tag_relation
     *   }
     * })
     * 
     */
    create<T extends job_tag_relationCreateArgs>(args: SelectSubset<T, job_tag_relationCreateArgs<ExtArgs>>): Prisma__job_tag_relationClient<$Result.GetResult<Prisma.$job_tag_relationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Job_tag_relations.
     * @param {job_tag_relationCreateManyArgs} args - Arguments to create many Job_tag_relations.
     * @example
     * // Create many Job_tag_relations
     * const job_tag_relation = await prisma.job_tag_relation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends job_tag_relationCreateManyArgs>(args?: SelectSubset<T, job_tag_relationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Job_tag_relations and returns the data saved in the database.
     * @param {job_tag_relationCreateManyAndReturnArgs} args - Arguments to create many Job_tag_relations.
     * @example
     * // Create many Job_tag_relations
     * const job_tag_relation = await prisma.job_tag_relation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Job_tag_relations and only return the `topic_id`
     * const job_tag_relationWithTopic_idOnly = await prisma.job_tag_relation.createManyAndReturn({ 
     *   select: { topic_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends job_tag_relationCreateManyAndReturnArgs>(args?: SelectSubset<T, job_tag_relationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$job_tag_relationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Job_tag_relation.
     * @param {job_tag_relationDeleteArgs} args - Arguments to delete one Job_tag_relation.
     * @example
     * // Delete one Job_tag_relation
     * const Job_tag_relation = await prisma.job_tag_relation.delete({
     *   where: {
     *     // ... filter to delete one Job_tag_relation
     *   }
     * })
     * 
     */
    delete<T extends job_tag_relationDeleteArgs>(args: SelectSubset<T, job_tag_relationDeleteArgs<ExtArgs>>): Prisma__job_tag_relationClient<$Result.GetResult<Prisma.$job_tag_relationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Job_tag_relation.
     * @param {job_tag_relationUpdateArgs} args - Arguments to update one Job_tag_relation.
     * @example
     * // Update one Job_tag_relation
     * const job_tag_relation = await prisma.job_tag_relation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends job_tag_relationUpdateArgs>(args: SelectSubset<T, job_tag_relationUpdateArgs<ExtArgs>>): Prisma__job_tag_relationClient<$Result.GetResult<Prisma.$job_tag_relationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Job_tag_relations.
     * @param {job_tag_relationDeleteManyArgs} args - Arguments to filter Job_tag_relations to delete.
     * @example
     * // Delete a few Job_tag_relations
     * const { count } = await prisma.job_tag_relation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends job_tag_relationDeleteManyArgs>(args?: SelectSubset<T, job_tag_relationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Job_tag_relations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {job_tag_relationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Job_tag_relations
     * const job_tag_relation = await prisma.job_tag_relation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends job_tag_relationUpdateManyArgs>(args: SelectSubset<T, job_tag_relationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Job_tag_relation.
     * @param {job_tag_relationUpsertArgs} args - Arguments to update or create a Job_tag_relation.
     * @example
     * // Update or create a Job_tag_relation
     * const job_tag_relation = await prisma.job_tag_relation.upsert({
     *   create: {
     *     // ... data to create a Job_tag_relation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Job_tag_relation we want to update
     *   }
     * })
     */
    upsert<T extends job_tag_relationUpsertArgs>(args: SelectSubset<T, job_tag_relationUpsertArgs<ExtArgs>>): Prisma__job_tag_relationClient<$Result.GetResult<Prisma.$job_tag_relationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Job_tag_relations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {job_tag_relationCountArgs} args - Arguments to filter Job_tag_relations to count.
     * @example
     * // Count the number of Job_tag_relations
     * const count = await prisma.job_tag_relation.count({
     *   where: {
     *     // ... the filter for the Job_tag_relations we want to count
     *   }
     * })
    **/
    count<T extends job_tag_relationCountArgs>(
      args?: Subset<T, job_tag_relationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Job_tag_relationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Job_tag_relation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Job_tag_relationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Job_tag_relationAggregateArgs>(args: Subset<T, Job_tag_relationAggregateArgs>): Prisma.PrismaPromise<GetJob_tag_relationAggregateType<T>>

    /**
     * Group by Job_tag_relation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {job_tag_relationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends job_tag_relationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: job_tag_relationGroupByArgs['orderBy'] }
        : { orderBy?: job_tag_relationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, job_tag_relationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJob_tag_relationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the job_tag_relation model
   */
  readonly fields: job_tag_relationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for job_tag_relation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__job_tag_relationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the job_tag_relation model
   */ 
  interface job_tag_relationFieldRefs {
    readonly topic_id: FieldRef<"job_tag_relation", 'BigInt'>
    readonly tag_id: FieldRef<"job_tag_relation", 'BigInt'>
    readonly ffrom: FieldRef<"job_tag_relation", 'String'>
  }
    

  // Custom InputTypes
  /**
   * job_tag_relation findUnique
   */
  export type job_tag_relationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_tag_relation
     */
    select?: job_tag_relationSelect<ExtArgs> | null
    /**
     * Filter, which job_tag_relation to fetch.
     */
    where: job_tag_relationWhereUniqueInput
  }

  /**
   * job_tag_relation findUniqueOrThrow
   */
  export type job_tag_relationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_tag_relation
     */
    select?: job_tag_relationSelect<ExtArgs> | null
    /**
     * Filter, which job_tag_relation to fetch.
     */
    where: job_tag_relationWhereUniqueInput
  }

  /**
   * job_tag_relation findFirst
   */
  export type job_tag_relationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_tag_relation
     */
    select?: job_tag_relationSelect<ExtArgs> | null
    /**
     * Filter, which job_tag_relation to fetch.
     */
    where?: job_tag_relationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of job_tag_relations to fetch.
     */
    orderBy?: job_tag_relationOrderByWithRelationInput | job_tag_relationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for job_tag_relations.
     */
    cursor?: job_tag_relationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` job_tag_relations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` job_tag_relations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of job_tag_relations.
     */
    distinct?: Job_tag_relationScalarFieldEnum | Job_tag_relationScalarFieldEnum[]
  }

  /**
   * job_tag_relation findFirstOrThrow
   */
  export type job_tag_relationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_tag_relation
     */
    select?: job_tag_relationSelect<ExtArgs> | null
    /**
     * Filter, which job_tag_relation to fetch.
     */
    where?: job_tag_relationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of job_tag_relations to fetch.
     */
    orderBy?: job_tag_relationOrderByWithRelationInput | job_tag_relationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for job_tag_relations.
     */
    cursor?: job_tag_relationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` job_tag_relations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` job_tag_relations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of job_tag_relations.
     */
    distinct?: Job_tag_relationScalarFieldEnum | Job_tag_relationScalarFieldEnum[]
  }

  /**
   * job_tag_relation findMany
   */
  export type job_tag_relationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_tag_relation
     */
    select?: job_tag_relationSelect<ExtArgs> | null
    /**
     * Filter, which job_tag_relations to fetch.
     */
    where?: job_tag_relationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of job_tag_relations to fetch.
     */
    orderBy?: job_tag_relationOrderByWithRelationInput | job_tag_relationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing job_tag_relations.
     */
    cursor?: job_tag_relationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` job_tag_relations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` job_tag_relations.
     */
    skip?: number
    distinct?: Job_tag_relationScalarFieldEnum | Job_tag_relationScalarFieldEnum[]
  }

  /**
   * job_tag_relation create
   */
  export type job_tag_relationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_tag_relation
     */
    select?: job_tag_relationSelect<ExtArgs> | null
    /**
     * The data needed to create a job_tag_relation.
     */
    data: XOR<job_tag_relationCreateInput, job_tag_relationUncheckedCreateInput>
  }

  /**
   * job_tag_relation createMany
   */
  export type job_tag_relationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many job_tag_relations.
     */
    data: job_tag_relationCreateManyInput | job_tag_relationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * job_tag_relation createManyAndReturn
   */
  export type job_tag_relationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_tag_relation
     */
    select?: job_tag_relationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many job_tag_relations.
     */
    data: job_tag_relationCreateManyInput | job_tag_relationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * job_tag_relation update
   */
  export type job_tag_relationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_tag_relation
     */
    select?: job_tag_relationSelect<ExtArgs> | null
    /**
     * The data needed to update a job_tag_relation.
     */
    data: XOR<job_tag_relationUpdateInput, job_tag_relationUncheckedUpdateInput>
    /**
     * Choose, which job_tag_relation to update.
     */
    where: job_tag_relationWhereUniqueInput
  }

  /**
   * job_tag_relation updateMany
   */
  export type job_tag_relationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update job_tag_relations.
     */
    data: XOR<job_tag_relationUpdateManyMutationInput, job_tag_relationUncheckedUpdateManyInput>
    /**
     * Filter which job_tag_relations to update
     */
    where?: job_tag_relationWhereInput
  }

  /**
   * job_tag_relation upsert
   */
  export type job_tag_relationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_tag_relation
     */
    select?: job_tag_relationSelect<ExtArgs> | null
    /**
     * The filter to search for the job_tag_relation to update in case it exists.
     */
    where: job_tag_relationWhereUniqueInput
    /**
     * In case the job_tag_relation found by the `where` argument doesn't exist, create a new job_tag_relation with this data.
     */
    create: XOR<job_tag_relationCreateInput, job_tag_relationUncheckedCreateInput>
    /**
     * In case the job_tag_relation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<job_tag_relationUpdateInput, job_tag_relationUncheckedUpdateInput>
  }

  /**
   * job_tag_relation delete
   */
  export type job_tag_relationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_tag_relation
     */
    select?: job_tag_relationSelect<ExtArgs> | null
    /**
     * Filter which job_tag_relation to delete.
     */
    where: job_tag_relationWhereUniqueInput
  }

  /**
   * job_tag_relation deleteMany
   */
  export type job_tag_relationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which job_tag_relations to delete
     */
    where?: job_tag_relationWhereInput
  }

  /**
   * job_tag_relation without action
   */
  export type job_tag_relationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_tag_relation
     */
    select?: job_tag_relationSelect<ExtArgs> | null
  }


  /**
   * Model tag
   */

  export type AggregateTag = {
    _count: TagCountAggregateOutputType | null
    _avg: TagAvgAggregateOutputType | null
    _sum: TagSumAggregateOutputType | null
    _min: TagMinAggregateOutputType | null
    _max: TagMaxAggregateOutputType | null
  }

  export type TagAvgAggregateOutputType = {
    tag_id: number | null
  }

  export type TagSumAggregateOutputType = {
    tag_id: bigint | null
  }

  export type TagMinAggregateOutputType = {
    tag_id: bigint | null
    tag_name: string | null
    ffrom: string | null
  }

  export type TagMaxAggregateOutputType = {
    tag_id: bigint | null
    tag_name: string | null
    ffrom: string | null
  }

  export type TagCountAggregateOutputType = {
    tag_id: number
    tag_name: number
    ffrom: number
    _all: number
  }


  export type TagAvgAggregateInputType = {
    tag_id?: true
  }

  export type TagSumAggregateInputType = {
    tag_id?: true
  }

  export type TagMinAggregateInputType = {
    tag_id?: true
    tag_name?: true
    ffrom?: true
  }

  export type TagMaxAggregateInputType = {
    tag_id?: true
    tag_name?: true
    ffrom?: true
  }

  export type TagCountAggregateInputType = {
    tag_id?: true
    tag_name?: true
    ffrom?: true
    _all?: true
  }

  export type TagAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tag to aggregate.
     */
    where?: tagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tags to fetch.
     */
    orderBy?: tagOrderByWithRelationInput | tagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: tagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned tags
    **/
    _count?: true | TagCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TagAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TagSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TagMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TagMaxAggregateInputType
  }

  export type GetTagAggregateType<T extends TagAggregateArgs> = {
        [P in keyof T & keyof AggregateTag]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTag[P]>
      : GetScalarType<T[P], AggregateTag[P]>
  }




  export type tagGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tagWhereInput
    orderBy?: tagOrderByWithAggregationInput | tagOrderByWithAggregationInput[]
    by: TagScalarFieldEnum[] | TagScalarFieldEnum
    having?: tagScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TagCountAggregateInputType | true
    _avg?: TagAvgAggregateInputType
    _sum?: TagSumAggregateInputType
    _min?: TagMinAggregateInputType
    _max?: TagMaxAggregateInputType
  }

  export type TagGroupByOutputType = {
    tag_id: bigint
    tag_name: string
    ffrom: string | null
    _count: TagCountAggregateOutputType | null
    _avg: TagAvgAggregateOutputType | null
    _sum: TagSumAggregateOutputType | null
    _min: TagMinAggregateOutputType | null
    _max: TagMaxAggregateOutputType | null
  }

  type GetTagGroupByPayload<T extends tagGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TagGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TagGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TagGroupByOutputType[P]>
            : GetScalarType<T[P], TagGroupByOutputType[P]>
        }
      >
    >


  export type tagSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    tag_id?: boolean
    tag_name?: boolean
    ffrom?: boolean
  }, ExtArgs["result"]["tag"]>

  export type tagSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    tag_id?: boolean
    tag_name?: boolean
    ffrom?: boolean
  }, ExtArgs["result"]["tag"]>

  export type tagSelectScalar = {
    tag_id?: boolean
    tag_name?: boolean
    ffrom?: boolean
  }


  export type $tagPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "tag"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      tag_id: bigint
      tag_name: string
      ffrom: string | null
    }, ExtArgs["result"]["tag"]>
    composites: {}
  }

  type tagGetPayload<S extends boolean | null | undefined | tagDefaultArgs> = $Result.GetResult<Prisma.$tagPayload, S>

  type tagCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<tagFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TagCountAggregateInputType | true
    }

  export interface tagDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['tag'], meta: { name: 'tag' } }
    /**
     * Find zero or one Tag that matches the filter.
     * @param {tagFindUniqueArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends tagFindUniqueArgs>(args: SelectSubset<T, tagFindUniqueArgs<ExtArgs>>): Prisma__tagClient<$Result.GetResult<Prisma.$tagPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Tag that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {tagFindUniqueOrThrowArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends tagFindUniqueOrThrowArgs>(args: SelectSubset<T, tagFindUniqueOrThrowArgs<ExtArgs>>): Prisma__tagClient<$Result.GetResult<Prisma.$tagPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Tag that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tagFindFirstArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends tagFindFirstArgs>(args?: SelectSubset<T, tagFindFirstArgs<ExtArgs>>): Prisma__tagClient<$Result.GetResult<Prisma.$tagPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Tag that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tagFindFirstOrThrowArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends tagFindFirstOrThrowArgs>(args?: SelectSubset<T, tagFindFirstOrThrowArgs<ExtArgs>>): Prisma__tagClient<$Result.GetResult<Prisma.$tagPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Tags that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tagFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tags
     * const tags = await prisma.tag.findMany()
     * 
     * // Get first 10 Tags
     * const tags = await prisma.tag.findMany({ take: 10 })
     * 
     * // Only select the `tag_id`
     * const tagWithTag_idOnly = await prisma.tag.findMany({ select: { tag_id: true } })
     * 
     */
    findMany<T extends tagFindManyArgs>(args?: SelectSubset<T, tagFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tagPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Tag.
     * @param {tagCreateArgs} args - Arguments to create a Tag.
     * @example
     * // Create one Tag
     * const Tag = await prisma.tag.create({
     *   data: {
     *     // ... data to create a Tag
     *   }
     * })
     * 
     */
    create<T extends tagCreateArgs>(args: SelectSubset<T, tagCreateArgs<ExtArgs>>): Prisma__tagClient<$Result.GetResult<Prisma.$tagPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Tags.
     * @param {tagCreateManyArgs} args - Arguments to create many Tags.
     * @example
     * // Create many Tags
     * const tag = await prisma.tag.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends tagCreateManyArgs>(args?: SelectSubset<T, tagCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tags and returns the data saved in the database.
     * @param {tagCreateManyAndReturnArgs} args - Arguments to create many Tags.
     * @example
     * // Create many Tags
     * const tag = await prisma.tag.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tags and only return the `tag_id`
     * const tagWithTag_idOnly = await prisma.tag.createManyAndReturn({ 
     *   select: { tag_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends tagCreateManyAndReturnArgs>(args?: SelectSubset<T, tagCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tagPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Tag.
     * @param {tagDeleteArgs} args - Arguments to delete one Tag.
     * @example
     * // Delete one Tag
     * const Tag = await prisma.tag.delete({
     *   where: {
     *     // ... filter to delete one Tag
     *   }
     * })
     * 
     */
    delete<T extends tagDeleteArgs>(args: SelectSubset<T, tagDeleteArgs<ExtArgs>>): Prisma__tagClient<$Result.GetResult<Prisma.$tagPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Tag.
     * @param {tagUpdateArgs} args - Arguments to update one Tag.
     * @example
     * // Update one Tag
     * const tag = await prisma.tag.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends tagUpdateArgs>(args: SelectSubset<T, tagUpdateArgs<ExtArgs>>): Prisma__tagClient<$Result.GetResult<Prisma.$tagPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Tags.
     * @param {tagDeleteManyArgs} args - Arguments to filter Tags to delete.
     * @example
     * // Delete a few Tags
     * const { count } = await prisma.tag.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends tagDeleteManyArgs>(args?: SelectSubset<T, tagDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tagUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tags
     * const tag = await prisma.tag.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends tagUpdateManyArgs>(args: SelectSubset<T, tagUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Tag.
     * @param {tagUpsertArgs} args - Arguments to update or create a Tag.
     * @example
     * // Update or create a Tag
     * const tag = await prisma.tag.upsert({
     *   create: {
     *     // ... data to create a Tag
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tag we want to update
     *   }
     * })
     */
    upsert<T extends tagUpsertArgs>(args: SelectSubset<T, tagUpsertArgs<ExtArgs>>): Prisma__tagClient<$Result.GetResult<Prisma.$tagPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Tags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tagCountArgs} args - Arguments to filter Tags to count.
     * @example
     * // Count the number of Tags
     * const count = await prisma.tag.count({
     *   where: {
     *     // ... the filter for the Tags we want to count
     *   }
     * })
    **/
    count<T extends tagCountArgs>(
      args?: Subset<T, tagCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TagCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TagAggregateArgs>(args: Subset<T, TagAggregateArgs>): Prisma.PrismaPromise<GetTagAggregateType<T>>

    /**
     * Group by Tag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tagGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends tagGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: tagGroupByArgs['orderBy'] }
        : { orderBy?: tagGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, tagGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the tag model
   */
  readonly fields: tagFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for tag.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__tagClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the tag model
   */ 
  interface tagFieldRefs {
    readonly tag_id: FieldRef<"tag", 'BigInt'>
    readonly tag_name: FieldRef<"tag", 'String'>
    readonly ffrom: FieldRef<"tag", 'String'>
  }
    

  // Custom InputTypes
  /**
   * tag findUnique
   */
  export type tagFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tag
     */
    select?: tagSelect<ExtArgs> | null
    /**
     * Filter, which tag to fetch.
     */
    where: tagWhereUniqueInput
  }

  /**
   * tag findUniqueOrThrow
   */
  export type tagFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tag
     */
    select?: tagSelect<ExtArgs> | null
    /**
     * Filter, which tag to fetch.
     */
    where: tagWhereUniqueInput
  }

  /**
   * tag findFirst
   */
  export type tagFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tag
     */
    select?: tagSelect<ExtArgs> | null
    /**
     * Filter, which tag to fetch.
     */
    where?: tagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tags to fetch.
     */
    orderBy?: tagOrderByWithRelationInput | tagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tags.
     */
    cursor?: tagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tags.
     */
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * tag findFirstOrThrow
   */
  export type tagFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tag
     */
    select?: tagSelect<ExtArgs> | null
    /**
     * Filter, which tag to fetch.
     */
    where?: tagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tags to fetch.
     */
    orderBy?: tagOrderByWithRelationInput | tagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tags.
     */
    cursor?: tagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tags.
     */
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * tag findMany
   */
  export type tagFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tag
     */
    select?: tagSelect<ExtArgs> | null
    /**
     * Filter, which tags to fetch.
     */
    where?: tagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tags to fetch.
     */
    orderBy?: tagOrderByWithRelationInput | tagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing tags.
     */
    cursor?: tagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tags.
     */
    skip?: number
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * tag create
   */
  export type tagCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tag
     */
    select?: tagSelect<ExtArgs> | null
    /**
     * The data needed to create a tag.
     */
    data: XOR<tagCreateInput, tagUncheckedCreateInput>
  }

  /**
   * tag createMany
   */
  export type tagCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many tags.
     */
    data: tagCreateManyInput | tagCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * tag createManyAndReturn
   */
  export type tagCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tag
     */
    select?: tagSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many tags.
     */
    data: tagCreateManyInput | tagCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * tag update
   */
  export type tagUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tag
     */
    select?: tagSelect<ExtArgs> | null
    /**
     * The data needed to update a tag.
     */
    data: XOR<tagUpdateInput, tagUncheckedUpdateInput>
    /**
     * Choose, which tag to update.
     */
    where: tagWhereUniqueInput
  }

  /**
   * tag updateMany
   */
  export type tagUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update tags.
     */
    data: XOR<tagUpdateManyMutationInput, tagUncheckedUpdateManyInput>
    /**
     * Filter which tags to update
     */
    where?: tagWhereInput
  }

  /**
   * tag upsert
   */
  export type tagUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tag
     */
    select?: tagSelect<ExtArgs> | null
    /**
     * The filter to search for the tag to update in case it exists.
     */
    where: tagWhereUniqueInput
    /**
     * In case the tag found by the `where` argument doesn't exist, create a new tag with this data.
     */
    create: XOR<tagCreateInput, tagUncheckedCreateInput>
    /**
     * In case the tag was found with the provided `where` argument, update it with this data.
     */
    update: XOR<tagUpdateInput, tagUncheckedUpdateInput>
  }

  /**
   * tag delete
   */
  export type tagDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tag
     */
    select?: tagSelect<ExtArgs> | null
    /**
     * Filter which tag to delete.
     */
    where: tagWhereUniqueInput
  }

  /**
   * tag deleteMany
   */
  export type tagDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tags to delete
     */
    where?: tagWhereInput
  }

  /**
   * tag without action
   */
  export type tagDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tag
     */
    select?: tagSelect<ExtArgs> | null
  }


  /**
   * Model user_info
   */

  export type AggregateUser_info = {
    _count: User_infoCountAggregateOutputType | null
    _avg: User_infoAvgAggregateOutputType | null
    _sum: User_infoSumAggregateOutputType | null
    _min: User_infoMinAggregateOutputType | null
    _max: User_infoMaxAggregateOutputType | null
  }

  export type User_infoAvgAggregateOutputType = {
    id: number | null
    topic_count: number | null
    comment_count: number | null
    fans_count: number | null
    follow_count: number | null
    score: number | null
    create_time: number | null
  }

  export type User_infoSumAggregateOutputType = {
    id: bigint | null
    topic_count: number | null
    comment_count: number | null
    fans_count: number | null
    follow_count: number | null
    score: number | null
    create_time: bigint | null
  }

  export type User_infoMinAggregateOutputType = {
    id: bigint | null
    nickname: string | null
    avatar: string | null
    small_avatar: string | null
    topic_count: number | null
    comment_count: number | null
    fans_count: number | null
    follow_count: number | null
    score: number | null
    description: string | null
    create_time: bigint | null
    wallet_address: string | null
    ffrom: string | null
    followed: boolean | null
  }

  export type User_infoMaxAggregateOutputType = {
    id: bigint | null
    nickname: string | null
    avatar: string | null
    small_avatar: string | null
    topic_count: number | null
    comment_count: number | null
    fans_count: number | null
    follow_count: number | null
    score: number | null
    description: string | null
    create_time: bigint | null
    wallet_address: string | null
    ffrom: string | null
    followed: boolean | null
  }

  export type User_infoCountAggregateOutputType = {
    id: number
    nickname: number
    avatar: number
    small_avatar: number
    topic_count: number
    comment_count: number
    fans_count: number
    follow_count: number
    score: number
    description: number
    create_time: number
    wallet_address: number
    ffrom: number
    followed: number
    _all: number
  }


  export type User_infoAvgAggregateInputType = {
    id?: true
    topic_count?: true
    comment_count?: true
    fans_count?: true
    follow_count?: true
    score?: true
    create_time?: true
  }

  export type User_infoSumAggregateInputType = {
    id?: true
    topic_count?: true
    comment_count?: true
    fans_count?: true
    follow_count?: true
    score?: true
    create_time?: true
  }

  export type User_infoMinAggregateInputType = {
    id?: true
    nickname?: true
    avatar?: true
    small_avatar?: true
    topic_count?: true
    comment_count?: true
    fans_count?: true
    follow_count?: true
    score?: true
    description?: true
    create_time?: true
    wallet_address?: true
    ffrom?: true
    followed?: true
  }

  export type User_infoMaxAggregateInputType = {
    id?: true
    nickname?: true
    avatar?: true
    small_avatar?: true
    topic_count?: true
    comment_count?: true
    fans_count?: true
    follow_count?: true
    score?: true
    description?: true
    create_time?: true
    wallet_address?: true
    ffrom?: true
    followed?: true
  }

  export type User_infoCountAggregateInputType = {
    id?: true
    nickname?: true
    avatar?: true
    small_avatar?: true
    topic_count?: true
    comment_count?: true
    fans_count?: true
    follow_count?: true
    score?: true
    description?: true
    create_time?: true
    wallet_address?: true
    ffrom?: true
    followed?: true
    _all?: true
  }

  export type User_infoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_info to aggregate.
     */
    where?: user_infoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_infos to fetch.
     */
    orderBy?: user_infoOrderByWithRelationInput | user_infoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: user_infoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_infos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_infos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned user_infos
    **/
    _count?: true | User_infoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: User_infoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: User_infoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: User_infoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: User_infoMaxAggregateInputType
  }

  export type GetUser_infoAggregateType<T extends User_infoAggregateArgs> = {
        [P in keyof T & keyof AggregateUser_info]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser_info[P]>
      : GetScalarType<T[P], AggregateUser_info[P]>
  }




  export type user_infoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: user_infoWhereInput
    orderBy?: user_infoOrderByWithAggregationInput | user_infoOrderByWithAggregationInput[]
    by: User_infoScalarFieldEnum[] | User_infoScalarFieldEnum
    having?: user_infoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: User_infoCountAggregateInputType | true
    _avg?: User_infoAvgAggregateInputType
    _sum?: User_infoSumAggregateInputType
    _min?: User_infoMinAggregateInputType
    _max?: User_infoMaxAggregateInputType
  }

  export type User_infoGroupByOutputType = {
    id: bigint
    nickname: string
    avatar: string | null
    small_avatar: string | null
    topic_count: number | null
    comment_count: number | null
    fans_count: number | null
    follow_count: number | null
    score: number | null
    description: string | null
    create_time: bigint | null
    wallet_address: string | null
    ffrom: string | null
    followed: boolean | null
    _count: User_infoCountAggregateOutputType | null
    _avg: User_infoAvgAggregateOutputType | null
    _sum: User_infoSumAggregateOutputType | null
    _min: User_infoMinAggregateOutputType | null
    _max: User_infoMaxAggregateOutputType | null
  }

  type GetUser_infoGroupByPayload<T extends user_infoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<User_infoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof User_infoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], User_infoGroupByOutputType[P]>
            : GetScalarType<T[P], User_infoGroupByOutputType[P]>
        }
      >
    >


  export type user_infoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nickname?: boolean
    avatar?: boolean
    small_avatar?: boolean
    topic_count?: boolean
    comment_count?: boolean
    fans_count?: boolean
    follow_count?: boolean
    score?: boolean
    description?: boolean
    create_time?: boolean
    wallet_address?: boolean
    ffrom?: boolean
    followed?: boolean
  }, ExtArgs["result"]["user_info"]>

  export type user_infoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nickname?: boolean
    avatar?: boolean
    small_avatar?: boolean
    topic_count?: boolean
    comment_count?: boolean
    fans_count?: boolean
    follow_count?: boolean
    score?: boolean
    description?: boolean
    create_time?: boolean
    wallet_address?: boolean
    ffrom?: boolean
    followed?: boolean
  }, ExtArgs["result"]["user_info"]>

  export type user_infoSelectScalar = {
    id?: boolean
    nickname?: boolean
    avatar?: boolean
    small_avatar?: boolean
    topic_count?: boolean
    comment_count?: boolean
    fans_count?: boolean
    follow_count?: boolean
    score?: boolean
    description?: boolean
    create_time?: boolean
    wallet_address?: boolean
    ffrom?: boolean
    followed?: boolean
  }


  export type $user_infoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "user_info"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      nickname: string
      avatar: string | null
      small_avatar: string | null
      topic_count: number | null
      comment_count: number | null
      fans_count: number | null
      follow_count: number | null
      score: number | null
      description: string | null
      create_time: bigint | null
      wallet_address: string | null
      ffrom: string | null
      followed: boolean | null
    }, ExtArgs["result"]["user_info"]>
    composites: {}
  }

  type user_infoGetPayload<S extends boolean | null | undefined | user_infoDefaultArgs> = $Result.GetResult<Prisma.$user_infoPayload, S>

  type user_infoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<user_infoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: User_infoCountAggregateInputType | true
    }

  export interface user_infoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['user_info'], meta: { name: 'user_info' } }
    /**
     * Find zero or one User_info that matches the filter.
     * @param {user_infoFindUniqueArgs} args - Arguments to find a User_info
     * @example
     * // Get one User_info
     * const user_info = await prisma.user_info.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends user_infoFindUniqueArgs>(args: SelectSubset<T, user_infoFindUniqueArgs<ExtArgs>>): Prisma__user_infoClient<$Result.GetResult<Prisma.$user_infoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User_info that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {user_infoFindUniqueOrThrowArgs} args - Arguments to find a User_info
     * @example
     * // Get one User_info
     * const user_info = await prisma.user_info.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends user_infoFindUniqueOrThrowArgs>(args: SelectSubset<T, user_infoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__user_infoClient<$Result.GetResult<Prisma.$user_infoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User_info that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_infoFindFirstArgs} args - Arguments to find a User_info
     * @example
     * // Get one User_info
     * const user_info = await prisma.user_info.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends user_infoFindFirstArgs>(args?: SelectSubset<T, user_infoFindFirstArgs<ExtArgs>>): Prisma__user_infoClient<$Result.GetResult<Prisma.$user_infoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User_info that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_infoFindFirstOrThrowArgs} args - Arguments to find a User_info
     * @example
     * // Get one User_info
     * const user_info = await prisma.user_info.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends user_infoFindFirstOrThrowArgs>(args?: SelectSubset<T, user_infoFindFirstOrThrowArgs<ExtArgs>>): Prisma__user_infoClient<$Result.GetResult<Prisma.$user_infoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more User_infos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_infoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all User_infos
     * const user_infos = await prisma.user_info.findMany()
     * 
     * // Get first 10 User_infos
     * const user_infos = await prisma.user_info.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const user_infoWithIdOnly = await prisma.user_info.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends user_infoFindManyArgs>(args?: SelectSubset<T, user_infoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_infoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User_info.
     * @param {user_infoCreateArgs} args - Arguments to create a User_info.
     * @example
     * // Create one User_info
     * const User_info = await prisma.user_info.create({
     *   data: {
     *     // ... data to create a User_info
     *   }
     * })
     * 
     */
    create<T extends user_infoCreateArgs>(args: SelectSubset<T, user_infoCreateArgs<ExtArgs>>): Prisma__user_infoClient<$Result.GetResult<Prisma.$user_infoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many User_infos.
     * @param {user_infoCreateManyArgs} args - Arguments to create many User_infos.
     * @example
     * // Create many User_infos
     * const user_info = await prisma.user_info.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends user_infoCreateManyArgs>(args?: SelectSubset<T, user_infoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many User_infos and returns the data saved in the database.
     * @param {user_infoCreateManyAndReturnArgs} args - Arguments to create many User_infos.
     * @example
     * // Create many User_infos
     * const user_info = await prisma.user_info.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many User_infos and only return the `id`
     * const user_infoWithIdOnly = await prisma.user_info.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends user_infoCreateManyAndReturnArgs>(args?: SelectSubset<T, user_infoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$user_infoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User_info.
     * @param {user_infoDeleteArgs} args - Arguments to delete one User_info.
     * @example
     * // Delete one User_info
     * const User_info = await prisma.user_info.delete({
     *   where: {
     *     // ... filter to delete one User_info
     *   }
     * })
     * 
     */
    delete<T extends user_infoDeleteArgs>(args: SelectSubset<T, user_infoDeleteArgs<ExtArgs>>): Prisma__user_infoClient<$Result.GetResult<Prisma.$user_infoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User_info.
     * @param {user_infoUpdateArgs} args - Arguments to update one User_info.
     * @example
     * // Update one User_info
     * const user_info = await prisma.user_info.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends user_infoUpdateArgs>(args: SelectSubset<T, user_infoUpdateArgs<ExtArgs>>): Prisma__user_infoClient<$Result.GetResult<Prisma.$user_infoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more User_infos.
     * @param {user_infoDeleteManyArgs} args - Arguments to filter User_infos to delete.
     * @example
     * // Delete a few User_infos
     * const { count } = await prisma.user_info.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends user_infoDeleteManyArgs>(args?: SelectSubset<T, user_infoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more User_infos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_infoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many User_infos
     * const user_info = await prisma.user_info.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends user_infoUpdateManyArgs>(args: SelectSubset<T, user_infoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User_info.
     * @param {user_infoUpsertArgs} args - Arguments to update or create a User_info.
     * @example
     * // Update or create a User_info
     * const user_info = await prisma.user_info.upsert({
     *   create: {
     *     // ... data to create a User_info
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User_info we want to update
     *   }
     * })
     */
    upsert<T extends user_infoUpsertArgs>(args: SelectSubset<T, user_infoUpsertArgs<ExtArgs>>): Prisma__user_infoClient<$Result.GetResult<Prisma.$user_infoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of User_infos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_infoCountArgs} args - Arguments to filter User_infos to count.
     * @example
     * // Count the number of User_infos
     * const count = await prisma.user_info.count({
     *   where: {
     *     // ... the filter for the User_infos we want to count
     *   }
     * })
    **/
    count<T extends user_infoCountArgs>(
      args?: Subset<T, user_infoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], User_infoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User_info.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {User_infoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends User_infoAggregateArgs>(args: Subset<T, User_infoAggregateArgs>): Prisma.PrismaPromise<GetUser_infoAggregateType<T>>

    /**
     * Group by User_info.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {user_infoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends user_infoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: user_infoGroupByArgs['orderBy'] }
        : { orderBy?: user_infoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, user_infoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUser_infoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the user_info model
   */
  readonly fields: user_infoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for user_info.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__user_infoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the user_info model
   */ 
  interface user_infoFieldRefs {
    readonly id: FieldRef<"user_info", 'BigInt'>
    readonly nickname: FieldRef<"user_info", 'String'>
    readonly avatar: FieldRef<"user_info", 'String'>
    readonly small_avatar: FieldRef<"user_info", 'String'>
    readonly topic_count: FieldRef<"user_info", 'Int'>
    readonly comment_count: FieldRef<"user_info", 'Int'>
    readonly fans_count: FieldRef<"user_info", 'Int'>
    readonly follow_count: FieldRef<"user_info", 'Int'>
    readonly score: FieldRef<"user_info", 'Int'>
    readonly description: FieldRef<"user_info", 'String'>
    readonly create_time: FieldRef<"user_info", 'BigInt'>
    readonly wallet_address: FieldRef<"user_info", 'String'>
    readonly ffrom: FieldRef<"user_info", 'String'>
    readonly followed: FieldRef<"user_info", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * user_info findUnique
   */
  export type user_infoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_info
     */
    select?: user_infoSelect<ExtArgs> | null
    /**
     * Filter, which user_info to fetch.
     */
    where: user_infoWhereUniqueInput
  }

  /**
   * user_info findUniqueOrThrow
   */
  export type user_infoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_info
     */
    select?: user_infoSelect<ExtArgs> | null
    /**
     * Filter, which user_info to fetch.
     */
    where: user_infoWhereUniqueInput
  }

  /**
   * user_info findFirst
   */
  export type user_infoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_info
     */
    select?: user_infoSelect<ExtArgs> | null
    /**
     * Filter, which user_info to fetch.
     */
    where?: user_infoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_infos to fetch.
     */
    orderBy?: user_infoOrderByWithRelationInput | user_infoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_infos.
     */
    cursor?: user_infoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_infos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_infos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_infos.
     */
    distinct?: User_infoScalarFieldEnum | User_infoScalarFieldEnum[]
  }

  /**
   * user_info findFirstOrThrow
   */
  export type user_infoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_info
     */
    select?: user_infoSelect<ExtArgs> | null
    /**
     * Filter, which user_info to fetch.
     */
    where?: user_infoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_infos to fetch.
     */
    orderBy?: user_infoOrderByWithRelationInput | user_infoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for user_infos.
     */
    cursor?: user_infoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_infos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_infos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of user_infos.
     */
    distinct?: User_infoScalarFieldEnum | User_infoScalarFieldEnum[]
  }

  /**
   * user_info findMany
   */
  export type user_infoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_info
     */
    select?: user_infoSelect<ExtArgs> | null
    /**
     * Filter, which user_infos to fetch.
     */
    where?: user_infoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of user_infos to fetch.
     */
    orderBy?: user_infoOrderByWithRelationInput | user_infoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing user_infos.
     */
    cursor?: user_infoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` user_infos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` user_infos.
     */
    skip?: number
    distinct?: User_infoScalarFieldEnum | User_infoScalarFieldEnum[]
  }

  /**
   * user_info create
   */
  export type user_infoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_info
     */
    select?: user_infoSelect<ExtArgs> | null
    /**
     * The data needed to create a user_info.
     */
    data: XOR<user_infoCreateInput, user_infoUncheckedCreateInput>
  }

  /**
   * user_info createMany
   */
  export type user_infoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many user_infos.
     */
    data: user_infoCreateManyInput | user_infoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * user_info createManyAndReturn
   */
  export type user_infoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_info
     */
    select?: user_infoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many user_infos.
     */
    data: user_infoCreateManyInput | user_infoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * user_info update
   */
  export type user_infoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_info
     */
    select?: user_infoSelect<ExtArgs> | null
    /**
     * The data needed to update a user_info.
     */
    data: XOR<user_infoUpdateInput, user_infoUncheckedUpdateInput>
    /**
     * Choose, which user_info to update.
     */
    where: user_infoWhereUniqueInput
  }

  /**
   * user_info updateMany
   */
  export type user_infoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update user_infos.
     */
    data: XOR<user_infoUpdateManyMutationInput, user_infoUncheckedUpdateManyInput>
    /**
     * Filter which user_infos to update
     */
    where?: user_infoWhereInput
  }

  /**
   * user_info upsert
   */
  export type user_infoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_info
     */
    select?: user_infoSelect<ExtArgs> | null
    /**
     * The filter to search for the user_info to update in case it exists.
     */
    where: user_infoWhereUniqueInput
    /**
     * In case the user_info found by the `where` argument doesn't exist, create a new user_info with this data.
     */
    create: XOR<user_infoCreateInput, user_infoUncheckedCreateInput>
    /**
     * In case the user_info was found with the provided `where` argument, update it with this data.
     */
    update: XOR<user_infoUpdateInput, user_infoUncheckedUpdateInput>
  }

  /**
   * user_info delete
   */
  export type user_infoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_info
     */
    select?: user_infoSelect<ExtArgs> | null
    /**
     * Filter which user_info to delete.
     */
    where: user_infoWhereUniqueInput
  }

  /**
   * user_info deleteMany
   */
  export type user_infoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which user_infos to delete
     */
    where?: user_infoWhereInput
  }

  /**
   * user_info without action
   */
  export type user_infoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the user_info
     */
    select?: user_infoSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const Job_postingScalarFieldEnum: {
    topic_id: 'topic_id',
    content: 'content',
    content2: 'content2',
    content3: 'content3',
    content5: 'content5',
    email: 'email',
    phone: 'phone',
    wechat: 'wechat',
    telegram: 'telegram',
    position_name: 'position_name',
    position_id: 'position_id',
    view_count: 'view_count',
    applied: 'applied',
    apply_count: 'apply_count',
    create_time: 'create_time',
    url: 'url',
    work_type_id: 'work_type_id',
    work_type_name: 'work_type_name',
    office_mode_id: 'office_mode_id',
    office_mode_name: 'office_mode_name',
    company: 'company',
    company_introduction: 'company_introduction',
    company_size_name: 'company_size_name',
    company_logo: 'company_logo',
    company_website: 'company_website',
    company_id: 'company_id',
    min_salary: 'min_salary',
    max_salary: 'max_salary',
    lever_id: 'lever_id',
    lever_name: 'lever_name',
    location: 'location',
    base: 'base',
    ffrom: 'ffrom',
    status: 'status'
  };

  export type Job_postingScalarFieldEnum = (typeof Job_postingScalarFieldEnum)[keyof typeof Job_postingScalarFieldEnum]


  export const Job_tag_relationScalarFieldEnum: {
    topic_id: 'topic_id',
    tag_id: 'tag_id',
    ffrom: 'ffrom'
  };

  export type Job_tag_relationScalarFieldEnum = (typeof Job_tag_relationScalarFieldEnum)[keyof typeof Job_tag_relationScalarFieldEnum]


  export const TagScalarFieldEnum: {
    tag_id: 'tag_id',
    tag_name: 'tag_name',
    ffrom: 'ffrom'
  };

  export type TagScalarFieldEnum = (typeof TagScalarFieldEnum)[keyof typeof TagScalarFieldEnum]


  export const User_infoScalarFieldEnum: {
    id: 'id',
    nickname: 'nickname',
    avatar: 'avatar',
    small_avatar: 'small_avatar',
    topic_count: 'topic_count',
    comment_count: 'comment_count',
    fans_count: 'fans_count',
    follow_count: 'follow_count',
    score: 'score',
    description: 'description',
    create_time: 'create_time',
    wallet_address: 'wallet_address',
    ffrom: 'ffrom',
    followed: 'followed'
  };

  export type User_infoScalarFieldEnum = (typeof User_infoScalarFieldEnum)[keyof typeof User_infoScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type job_postingWhereInput = {
    AND?: job_postingWhereInput | job_postingWhereInput[]
    OR?: job_postingWhereInput[]
    NOT?: job_postingWhereInput | job_postingWhereInput[]
    topic_id?: BigIntFilter<"job_posting"> | bigint | number
    content?: StringNullableFilter<"job_posting"> | string | null
    content2?: StringNullableFilter<"job_posting"> | string | null
    content3?: StringNullableFilter<"job_posting"> | string | null
    content5?: StringNullableFilter<"job_posting"> | string | null
    email?: StringNullableFilter<"job_posting"> | string | null
    phone?: StringNullableFilter<"job_posting"> | string | null
    wechat?: StringNullableFilter<"job_posting"> | string | null
    telegram?: StringNullableFilter<"job_posting"> | string | null
    position_name?: StringFilter<"job_posting"> | string
    position_id?: BigIntNullableFilter<"job_posting"> | bigint | number | null
    view_count?: IntNullableFilter<"job_posting"> | number | null
    applied?: BoolNullableFilter<"job_posting"> | boolean | null
    apply_count?: IntNullableFilter<"job_posting"> | number | null
    create_time?: BigIntNullableFilter<"job_posting"> | bigint | number | null
    url?: StringNullableFilter<"job_posting"> | string | null
    work_type_id?: IntNullableFilter<"job_posting"> | number | null
    work_type_name?: StringNullableFilter<"job_posting"> | string | null
    office_mode_id?: IntNullableFilter<"job_posting"> | number | null
    office_mode_name?: StringNullableFilter<"job_posting"> | string | null
    company?: StringFilter<"job_posting"> | string
    company_introduction?: StringNullableFilter<"job_posting"> | string | null
    company_size_name?: StringNullableFilter<"job_posting"> | string | null
    company_logo?: StringNullableFilter<"job_posting"> | string | null
    company_website?: StringNullableFilter<"job_posting"> | string | null
    company_id?: BigIntNullableFilter<"job_posting"> | bigint | number | null
    min_salary?: DecimalNullableFilter<"job_posting"> | Decimal | DecimalJsLike | number | string | null
    max_salary?: DecimalNullableFilter<"job_posting"> | Decimal | DecimalJsLike | number | string | null
    lever_id?: IntNullableFilter<"job_posting"> | number | null
    lever_name?: StringNullableFilter<"job_posting"> | string | null
    location?: StringNullableFilter<"job_posting"> | string | null
    base?: StringNullableFilter<"job_posting"> | string | null
    ffrom?: StringNullableFilter<"job_posting"> | string | null
    status?: IntNullableFilter<"job_posting"> | number | null
  }

  export type job_postingOrderByWithRelationInput = {
    topic_id?: SortOrder
    content?: SortOrderInput | SortOrder
    content2?: SortOrderInput | SortOrder
    content3?: SortOrderInput | SortOrder
    content5?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    wechat?: SortOrderInput | SortOrder
    telegram?: SortOrderInput | SortOrder
    position_name?: SortOrder
    position_id?: SortOrderInput | SortOrder
    view_count?: SortOrderInput | SortOrder
    applied?: SortOrderInput | SortOrder
    apply_count?: SortOrderInput | SortOrder
    create_time?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    work_type_id?: SortOrderInput | SortOrder
    work_type_name?: SortOrderInput | SortOrder
    office_mode_id?: SortOrderInput | SortOrder
    office_mode_name?: SortOrderInput | SortOrder
    company?: SortOrder
    company_introduction?: SortOrderInput | SortOrder
    company_size_name?: SortOrderInput | SortOrder
    company_logo?: SortOrderInput | SortOrder
    company_website?: SortOrderInput | SortOrder
    company_id?: SortOrderInput | SortOrder
    min_salary?: SortOrderInput | SortOrder
    max_salary?: SortOrderInput | SortOrder
    lever_id?: SortOrderInput | SortOrder
    lever_name?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    base?: SortOrderInput | SortOrder
    ffrom?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
  }

  export type job_postingWhereUniqueInput = Prisma.AtLeast<{
    topic_id?: bigint | number
    AND?: job_postingWhereInput | job_postingWhereInput[]
    OR?: job_postingWhereInput[]
    NOT?: job_postingWhereInput | job_postingWhereInput[]
    content?: StringNullableFilter<"job_posting"> | string | null
    content2?: StringNullableFilter<"job_posting"> | string | null
    content3?: StringNullableFilter<"job_posting"> | string | null
    content5?: StringNullableFilter<"job_posting"> | string | null
    email?: StringNullableFilter<"job_posting"> | string | null
    phone?: StringNullableFilter<"job_posting"> | string | null
    wechat?: StringNullableFilter<"job_posting"> | string | null
    telegram?: StringNullableFilter<"job_posting"> | string | null
    position_name?: StringFilter<"job_posting"> | string
    position_id?: BigIntNullableFilter<"job_posting"> | bigint | number | null
    view_count?: IntNullableFilter<"job_posting"> | number | null
    applied?: BoolNullableFilter<"job_posting"> | boolean | null
    apply_count?: IntNullableFilter<"job_posting"> | number | null
    create_time?: BigIntNullableFilter<"job_posting"> | bigint | number | null
    url?: StringNullableFilter<"job_posting"> | string | null
    work_type_id?: IntNullableFilter<"job_posting"> | number | null
    work_type_name?: StringNullableFilter<"job_posting"> | string | null
    office_mode_id?: IntNullableFilter<"job_posting"> | number | null
    office_mode_name?: StringNullableFilter<"job_posting"> | string | null
    company?: StringFilter<"job_posting"> | string
    company_introduction?: StringNullableFilter<"job_posting"> | string | null
    company_size_name?: StringNullableFilter<"job_posting"> | string | null
    company_logo?: StringNullableFilter<"job_posting"> | string | null
    company_website?: StringNullableFilter<"job_posting"> | string | null
    company_id?: BigIntNullableFilter<"job_posting"> | bigint | number | null
    min_salary?: DecimalNullableFilter<"job_posting"> | Decimal | DecimalJsLike | number | string | null
    max_salary?: DecimalNullableFilter<"job_posting"> | Decimal | DecimalJsLike | number | string | null
    lever_id?: IntNullableFilter<"job_posting"> | number | null
    lever_name?: StringNullableFilter<"job_posting"> | string | null
    location?: StringNullableFilter<"job_posting"> | string | null
    base?: StringNullableFilter<"job_posting"> | string | null
    ffrom?: StringNullableFilter<"job_posting"> | string | null
    status?: IntNullableFilter<"job_posting"> | number | null
  }, "topic_id">

  export type job_postingOrderByWithAggregationInput = {
    topic_id?: SortOrder
    content?: SortOrderInput | SortOrder
    content2?: SortOrderInput | SortOrder
    content3?: SortOrderInput | SortOrder
    content5?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    wechat?: SortOrderInput | SortOrder
    telegram?: SortOrderInput | SortOrder
    position_name?: SortOrder
    position_id?: SortOrderInput | SortOrder
    view_count?: SortOrderInput | SortOrder
    applied?: SortOrderInput | SortOrder
    apply_count?: SortOrderInput | SortOrder
    create_time?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    work_type_id?: SortOrderInput | SortOrder
    work_type_name?: SortOrderInput | SortOrder
    office_mode_id?: SortOrderInput | SortOrder
    office_mode_name?: SortOrderInput | SortOrder
    company?: SortOrder
    company_introduction?: SortOrderInput | SortOrder
    company_size_name?: SortOrderInput | SortOrder
    company_logo?: SortOrderInput | SortOrder
    company_website?: SortOrderInput | SortOrder
    company_id?: SortOrderInput | SortOrder
    min_salary?: SortOrderInput | SortOrder
    max_salary?: SortOrderInput | SortOrder
    lever_id?: SortOrderInput | SortOrder
    lever_name?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    base?: SortOrderInput | SortOrder
    ffrom?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    _count?: job_postingCountOrderByAggregateInput
    _avg?: job_postingAvgOrderByAggregateInput
    _max?: job_postingMaxOrderByAggregateInput
    _min?: job_postingMinOrderByAggregateInput
    _sum?: job_postingSumOrderByAggregateInput
  }

  export type job_postingScalarWhereWithAggregatesInput = {
    AND?: job_postingScalarWhereWithAggregatesInput | job_postingScalarWhereWithAggregatesInput[]
    OR?: job_postingScalarWhereWithAggregatesInput[]
    NOT?: job_postingScalarWhereWithAggregatesInput | job_postingScalarWhereWithAggregatesInput[]
    topic_id?: BigIntWithAggregatesFilter<"job_posting"> | bigint | number
    content?: StringNullableWithAggregatesFilter<"job_posting"> | string | null
    content2?: StringNullableWithAggregatesFilter<"job_posting"> | string | null
    content3?: StringNullableWithAggregatesFilter<"job_posting"> | string | null
    content5?: StringNullableWithAggregatesFilter<"job_posting"> | string | null
    email?: StringNullableWithAggregatesFilter<"job_posting"> | string | null
    phone?: StringNullableWithAggregatesFilter<"job_posting"> | string | null
    wechat?: StringNullableWithAggregatesFilter<"job_posting"> | string | null
    telegram?: StringNullableWithAggregatesFilter<"job_posting"> | string | null
    position_name?: StringWithAggregatesFilter<"job_posting"> | string
    position_id?: BigIntNullableWithAggregatesFilter<"job_posting"> | bigint | number | null
    view_count?: IntNullableWithAggregatesFilter<"job_posting"> | number | null
    applied?: BoolNullableWithAggregatesFilter<"job_posting"> | boolean | null
    apply_count?: IntNullableWithAggregatesFilter<"job_posting"> | number | null
    create_time?: BigIntNullableWithAggregatesFilter<"job_posting"> | bigint | number | null
    url?: StringNullableWithAggregatesFilter<"job_posting"> | string | null
    work_type_id?: IntNullableWithAggregatesFilter<"job_posting"> | number | null
    work_type_name?: StringNullableWithAggregatesFilter<"job_posting"> | string | null
    office_mode_id?: IntNullableWithAggregatesFilter<"job_posting"> | number | null
    office_mode_name?: StringNullableWithAggregatesFilter<"job_posting"> | string | null
    company?: StringWithAggregatesFilter<"job_posting"> | string
    company_introduction?: StringNullableWithAggregatesFilter<"job_posting"> | string | null
    company_size_name?: StringNullableWithAggregatesFilter<"job_posting"> | string | null
    company_logo?: StringNullableWithAggregatesFilter<"job_posting"> | string | null
    company_website?: StringNullableWithAggregatesFilter<"job_posting"> | string | null
    company_id?: BigIntNullableWithAggregatesFilter<"job_posting"> | bigint | number | null
    min_salary?: DecimalNullableWithAggregatesFilter<"job_posting"> | Decimal | DecimalJsLike | number | string | null
    max_salary?: DecimalNullableWithAggregatesFilter<"job_posting"> | Decimal | DecimalJsLike | number | string | null
    lever_id?: IntNullableWithAggregatesFilter<"job_posting"> | number | null
    lever_name?: StringNullableWithAggregatesFilter<"job_posting"> | string | null
    location?: StringNullableWithAggregatesFilter<"job_posting"> | string | null
    base?: StringNullableWithAggregatesFilter<"job_posting"> | string | null
    ffrom?: StringNullableWithAggregatesFilter<"job_posting"> | string | null
    status?: IntNullableWithAggregatesFilter<"job_posting"> | number | null
  }

  export type job_tag_relationWhereInput = {
    AND?: job_tag_relationWhereInput | job_tag_relationWhereInput[]
    OR?: job_tag_relationWhereInput[]
    NOT?: job_tag_relationWhereInput | job_tag_relationWhereInput[]
    topic_id?: BigIntFilter<"job_tag_relation"> | bigint | number
    tag_id?: BigIntFilter<"job_tag_relation"> | bigint | number
    ffrom?: StringNullableFilter<"job_tag_relation"> | string | null
  }

  export type job_tag_relationOrderByWithRelationInput = {
    topic_id?: SortOrder
    tag_id?: SortOrder
    ffrom?: SortOrderInput | SortOrder
  }

  export type job_tag_relationWhereUniqueInput = Prisma.AtLeast<{
    topic_id_tag_id?: job_tag_relationTopic_idTag_idCompoundUniqueInput
    AND?: job_tag_relationWhereInput | job_tag_relationWhereInput[]
    OR?: job_tag_relationWhereInput[]
    NOT?: job_tag_relationWhereInput | job_tag_relationWhereInput[]
    topic_id?: BigIntFilter<"job_tag_relation"> | bigint | number
    tag_id?: BigIntFilter<"job_tag_relation"> | bigint | number
    ffrom?: StringNullableFilter<"job_tag_relation"> | string | null
  }, "topic_id_tag_id">

  export type job_tag_relationOrderByWithAggregationInput = {
    topic_id?: SortOrder
    tag_id?: SortOrder
    ffrom?: SortOrderInput | SortOrder
    _count?: job_tag_relationCountOrderByAggregateInput
    _avg?: job_tag_relationAvgOrderByAggregateInput
    _max?: job_tag_relationMaxOrderByAggregateInput
    _min?: job_tag_relationMinOrderByAggregateInput
    _sum?: job_tag_relationSumOrderByAggregateInput
  }

  export type job_tag_relationScalarWhereWithAggregatesInput = {
    AND?: job_tag_relationScalarWhereWithAggregatesInput | job_tag_relationScalarWhereWithAggregatesInput[]
    OR?: job_tag_relationScalarWhereWithAggregatesInput[]
    NOT?: job_tag_relationScalarWhereWithAggregatesInput | job_tag_relationScalarWhereWithAggregatesInput[]
    topic_id?: BigIntWithAggregatesFilter<"job_tag_relation"> | bigint | number
    tag_id?: BigIntWithAggregatesFilter<"job_tag_relation"> | bigint | number
    ffrom?: StringNullableWithAggregatesFilter<"job_tag_relation"> | string | null
  }

  export type tagWhereInput = {
    AND?: tagWhereInput | tagWhereInput[]
    OR?: tagWhereInput[]
    NOT?: tagWhereInput | tagWhereInput[]
    tag_id?: BigIntFilter<"tag"> | bigint | number
    tag_name?: StringFilter<"tag"> | string
    ffrom?: StringNullableFilter<"tag"> | string | null
  }

  export type tagOrderByWithRelationInput = {
    tag_id?: SortOrder
    tag_name?: SortOrder
    ffrom?: SortOrderInput | SortOrder
  }

  export type tagWhereUniqueInput = Prisma.AtLeast<{
    tag_id?: bigint | number
    AND?: tagWhereInput | tagWhereInput[]
    OR?: tagWhereInput[]
    NOT?: tagWhereInput | tagWhereInput[]
    tag_name?: StringFilter<"tag"> | string
    ffrom?: StringNullableFilter<"tag"> | string | null
  }, "tag_id">

  export type tagOrderByWithAggregationInput = {
    tag_id?: SortOrder
    tag_name?: SortOrder
    ffrom?: SortOrderInput | SortOrder
    _count?: tagCountOrderByAggregateInput
    _avg?: tagAvgOrderByAggregateInput
    _max?: tagMaxOrderByAggregateInput
    _min?: tagMinOrderByAggregateInput
    _sum?: tagSumOrderByAggregateInput
  }

  export type tagScalarWhereWithAggregatesInput = {
    AND?: tagScalarWhereWithAggregatesInput | tagScalarWhereWithAggregatesInput[]
    OR?: tagScalarWhereWithAggregatesInput[]
    NOT?: tagScalarWhereWithAggregatesInput | tagScalarWhereWithAggregatesInput[]
    tag_id?: BigIntWithAggregatesFilter<"tag"> | bigint | number
    tag_name?: StringWithAggregatesFilter<"tag"> | string
    ffrom?: StringNullableWithAggregatesFilter<"tag"> | string | null
  }

  export type user_infoWhereInput = {
    AND?: user_infoWhereInput | user_infoWhereInput[]
    OR?: user_infoWhereInput[]
    NOT?: user_infoWhereInput | user_infoWhereInput[]
    id?: BigIntFilter<"user_info"> | bigint | number
    nickname?: StringFilter<"user_info"> | string
    avatar?: StringNullableFilter<"user_info"> | string | null
    small_avatar?: StringNullableFilter<"user_info"> | string | null
    topic_count?: IntNullableFilter<"user_info"> | number | null
    comment_count?: IntNullableFilter<"user_info"> | number | null
    fans_count?: IntNullableFilter<"user_info"> | number | null
    follow_count?: IntNullableFilter<"user_info"> | number | null
    score?: IntNullableFilter<"user_info"> | number | null
    description?: StringNullableFilter<"user_info"> | string | null
    create_time?: BigIntNullableFilter<"user_info"> | bigint | number | null
    wallet_address?: StringNullableFilter<"user_info"> | string | null
    ffrom?: StringNullableFilter<"user_info"> | string | null
    followed?: BoolNullableFilter<"user_info"> | boolean | null
  }

  export type user_infoOrderByWithRelationInput = {
    id?: SortOrder
    nickname?: SortOrder
    avatar?: SortOrderInput | SortOrder
    small_avatar?: SortOrderInput | SortOrder
    topic_count?: SortOrderInput | SortOrder
    comment_count?: SortOrderInput | SortOrder
    fans_count?: SortOrderInput | SortOrder
    follow_count?: SortOrderInput | SortOrder
    score?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    create_time?: SortOrderInput | SortOrder
    wallet_address?: SortOrderInput | SortOrder
    ffrom?: SortOrderInput | SortOrder
    followed?: SortOrderInput | SortOrder
  }

  export type user_infoWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: user_infoWhereInput | user_infoWhereInput[]
    OR?: user_infoWhereInput[]
    NOT?: user_infoWhereInput | user_infoWhereInput[]
    nickname?: StringFilter<"user_info"> | string
    avatar?: StringNullableFilter<"user_info"> | string | null
    small_avatar?: StringNullableFilter<"user_info"> | string | null
    topic_count?: IntNullableFilter<"user_info"> | number | null
    comment_count?: IntNullableFilter<"user_info"> | number | null
    fans_count?: IntNullableFilter<"user_info"> | number | null
    follow_count?: IntNullableFilter<"user_info"> | number | null
    score?: IntNullableFilter<"user_info"> | number | null
    description?: StringNullableFilter<"user_info"> | string | null
    create_time?: BigIntNullableFilter<"user_info"> | bigint | number | null
    wallet_address?: StringNullableFilter<"user_info"> | string | null
    ffrom?: StringNullableFilter<"user_info"> | string | null
    followed?: BoolNullableFilter<"user_info"> | boolean | null
  }, "id">

  export type user_infoOrderByWithAggregationInput = {
    id?: SortOrder
    nickname?: SortOrder
    avatar?: SortOrderInput | SortOrder
    small_avatar?: SortOrderInput | SortOrder
    topic_count?: SortOrderInput | SortOrder
    comment_count?: SortOrderInput | SortOrder
    fans_count?: SortOrderInput | SortOrder
    follow_count?: SortOrderInput | SortOrder
    score?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    create_time?: SortOrderInput | SortOrder
    wallet_address?: SortOrderInput | SortOrder
    ffrom?: SortOrderInput | SortOrder
    followed?: SortOrderInput | SortOrder
    _count?: user_infoCountOrderByAggregateInput
    _avg?: user_infoAvgOrderByAggregateInput
    _max?: user_infoMaxOrderByAggregateInput
    _min?: user_infoMinOrderByAggregateInput
    _sum?: user_infoSumOrderByAggregateInput
  }

  export type user_infoScalarWhereWithAggregatesInput = {
    AND?: user_infoScalarWhereWithAggregatesInput | user_infoScalarWhereWithAggregatesInput[]
    OR?: user_infoScalarWhereWithAggregatesInput[]
    NOT?: user_infoScalarWhereWithAggregatesInput | user_infoScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"user_info"> | bigint | number
    nickname?: StringWithAggregatesFilter<"user_info"> | string
    avatar?: StringNullableWithAggregatesFilter<"user_info"> | string | null
    small_avatar?: StringNullableWithAggregatesFilter<"user_info"> | string | null
    topic_count?: IntNullableWithAggregatesFilter<"user_info"> | number | null
    comment_count?: IntNullableWithAggregatesFilter<"user_info"> | number | null
    fans_count?: IntNullableWithAggregatesFilter<"user_info"> | number | null
    follow_count?: IntNullableWithAggregatesFilter<"user_info"> | number | null
    score?: IntNullableWithAggregatesFilter<"user_info"> | number | null
    description?: StringNullableWithAggregatesFilter<"user_info"> | string | null
    create_time?: BigIntNullableWithAggregatesFilter<"user_info"> | bigint | number | null
    wallet_address?: StringNullableWithAggregatesFilter<"user_info"> | string | null
    ffrom?: StringNullableWithAggregatesFilter<"user_info"> | string | null
    followed?: BoolNullableWithAggregatesFilter<"user_info"> | boolean | null
  }

  export type job_postingCreateInput = {
    topic_id: bigint | number
    content?: string | null
    content2?: string | null
    content3?: string | null
    content5?: string | null
    email?: string | null
    phone?: string | null
    wechat?: string | null
    telegram?: string | null
    position_name: string
    position_id?: bigint | number | null
    view_count?: number | null
    applied?: boolean | null
    apply_count?: number | null
    create_time?: bigint | number | null
    url?: string | null
    work_type_id?: number | null
    work_type_name?: string | null
    office_mode_id?: number | null
    office_mode_name?: string | null
    company: string
    company_introduction?: string | null
    company_size_name?: string | null
    company_logo?: string | null
    company_website?: string | null
    company_id?: bigint | number | null
    min_salary?: Decimal | DecimalJsLike | number | string | null
    max_salary?: Decimal | DecimalJsLike | number | string | null
    lever_id?: number | null
    lever_name?: string | null
    location?: string | null
    base?: string | null
    ffrom?: string | null
    status?: number | null
  }

  export type job_postingUncheckedCreateInput = {
    topic_id: bigint | number
    content?: string | null
    content2?: string | null
    content3?: string | null
    content5?: string | null
    email?: string | null
    phone?: string | null
    wechat?: string | null
    telegram?: string | null
    position_name: string
    position_id?: bigint | number | null
    view_count?: number | null
    applied?: boolean | null
    apply_count?: number | null
    create_time?: bigint | number | null
    url?: string | null
    work_type_id?: number | null
    work_type_name?: string | null
    office_mode_id?: number | null
    office_mode_name?: string | null
    company: string
    company_introduction?: string | null
    company_size_name?: string | null
    company_logo?: string | null
    company_website?: string | null
    company_id?: bigint | number | null
    min_salary?: Decimal | DecimalJsLike | number | string | null
    max_salary?: Decimal | DecimalJsLike | number | string | null
    lever_id?: number | null
    lever_name?: string | null
    location?: string | null
    base?: string | null
    ffrom?: string | null
    status?: number | null
  }

  export type job_postingUpdateInput = {
    topic_id?: BigIntFieldUpdateOperationsInput | bigint | number
    content?: NullableStringFieldUpdateOperationsInput | string | null
    content2?: NullableStringFieldUpdateOperationsInput | string | null
    content3?: NullableStringFieldUpdateOperationsInput | string | null
    content5?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    wechat?: NullableStringFieldUpdateOperationsInput | string | null
    telegram?: NullableStringFieldUpdateOperationsInput | string | null
    position_name?: StringFieldUpdateOperationsInput | string
    position_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    view_count?: NullableIntFieldUpdateOperationsInput | number | null
    applied?: NullableBoolFieldUpdateOperationsInput | boolean | null
    apply_count?: NullableIntFieldUpdateOperationsInput | number | null
    create_time?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    work_type_id?: NullableIntFieldUpdateOperationsInput | number | null
    work_type_name?: NullableStringFieldUpdateOperationsInput | string | null
    office_mode_id?: NullableIntFieldUpdateOperationsInput | number | null
    office_mode_name?: NullableStringFieldUpdateOperationsInput | string | null
    company?: StringFieldUpdateOperationsInput | string
    company_introduction?: NullableStringFieldUpdateOperationsInput | string | null
    company_size_name?: NullableStringFieldUpdateOperationsInput | string | null
    company_logo?: NullableStringFieldUpdateOperationsInput | string | null
    company_website?: NullableStringFieldUpdateOperationsInput | string | null
    company_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    min_salary?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    max_salary?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lever_id?: NullableIntFieldUpdateOperationsInput | number | null
    lever_name?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    base?: NullableStringFieldUpdateOperationsInput | string | null
    ffrom?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type job_postingUncheckedUpdateInput = {
    topic_id?: BigIntFieldUpdateOperationsInput | bigint | number
    content?: NullableStringFieldUpdateOperationsInput | string | null
    content2?: NullableStringFieldUpdateOperationsInput | string | null
    content3?: NullableStringFieldUpdateOperationsInput | string | null
    content5?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    wechat?: NullableStringFieldUpdateOperationsInput | string | null
    telegram?: NullableStringFieldUpdateOperationsInput | string | null
    position_name?: StringFieldUpdateOperationsInput | string
    position_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    view_count?: NullableIntFieldUpdateOperationsInput | number | null
    applied?: NullableBoolFieldUpdateOperationsInput | boolean | null
    apply_count?: NullableIntFieldUpdateOperationsInput | number | null
    create_time?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    work_type_id?: NullableIntFieldUpdateOperationsInput | number | null
    work_type_name?: NullableStringFieldUpdateOperationsInput | string | null
    office_mode_id?: NullableIntFieldUpdateOperationsInput | number | null
    office_mode_name?: NullableStringFieldUpdateOperationsInput | string | null
    company?: StringFieldUpdateOperationsInput | string
    company_introduction?: NullableStringFieldUpdateOperationsInput | string | null
    company_size_name?: NullableStringFieldUpdateOperationsInput | string | null
    company_logo?: NullableStringFieldUpdateOperationsInput | string | null
    company_website?: NullableStringFieldUpdateOperationsInput | string | null
    company_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    min_salary?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    max_salary?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lever_id?: NullableIntFieldUpdateOperationsInput | number | null
    lever_name?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    base?: NullableStringFieldUpdateOperationsInput | string | null
    ffrom?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type job_postingCreateManyInput = {
    topic_id: bigint | number
    content?: string | null
    content2?: string | null
    content3?: string | null
    content5?: string | null
    email?: string | null
    phone?: string | null
    wechat?: string | null
    telegram?: string | null
    position_name: string
    position_id?: bigint | number | null
    view_count?: number | null
    applied?: boolean | null
    apply_count?: number | null
    create_time?: bigint | number | null
    url?: string | null
    work_type_id?: number | null
    work_type_name?: string | null
    office_mode_id?: number | null
    office_mode_name?: string | null
    company: string
    company_introduction?: string | null
    company_size_name?: string | null
    company_logo?: string | null
    company_website?: string | null
    company_id?: bigint | number | null
    min_salary?: Decimal | DecimalJsLike | number | string | null
    max_salary?: Decimal | DecimalJsLike | number | string | null
    lever_id?: number | null
    lever_name?: string | null
    location?: string | null
    base?: string | null
    ffrom?: string | null
    status?: number | null
  }

  export type job_postingUpdateManyMutationInput = {
    topic_id?: BigIntFieldUpdateOperationsInput | bigint | number
    content?: NullableStringFieldUpdateOperationsInput | string | null
    content2?: NullableStringFieldUpdateOperationsInput | string | null
    content3?: NullableStringFieldUpdateOperationsInput | string | null
    content5?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    wechat?: NullableStringFieldUpdateOperationsInput | string | null
    telegram?: NullableStringFieldUpdateOperationsInput | string | null
    position_name?: StringFieldUpdateOperationsInput | string
    position_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    view_count?: NullableIntFieldUpdateOperationsInput | number | null
    applied?: NullableBoolFieldUpdateOperationsInput | boolean | null
    apply_count?: NullableIntFieldUpdateOperationsInput | number | null
    create_time?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    work_type_id?: NullableIntFieldUpdateOperationsInput | number | null
    work_type_name?: NullableStringFieldUpdateOperationsInput | string | null
    office_mode_id?: NullableIntFieldUpdateOperationsInput | number | null
    office_mode_name?: NullableStringFieldUpdateOperationsInput | string | null
    company?: StringFieldUpdateOperationsInput | string
    company_introduction?: NullableStringFieldUpdateOperationsInput | string | null
    company_size_name?: NullableStringFieldUpdateOperationsInput | string | null
    company_logo?: NullableStringFieldUpdateOperationsInput | string | null
    company_website?: NullableStringFieldUpdateOperationsInput | string | null
    company_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    min_salary?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    max_salary?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lever_id?: NullableIntFieldUpdateOperationsInput | number | null
    lever_name?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    base?: NullableStringFieldUpdateOperationsInput | string | null
    ffrom?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type job_postingUncheckedUpdateManyInput = {
    topic_id?: BigIntFieldUpdateOperationsInput | bigint | number
    content?: NullableStringFieldUpdateOperationsInput | string | null
    content2?: NullableStringFieldUpdateOperationsInput | string | null
    content3?: NullableStringFieldUpdateOperationsInput | string | null
    content5?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    wechat?: NullableStringFieldUpdateOperationsInput | string | null
    telegram?: NullableStringFieldUpdateOperationsInput | string | null
    position_name?: StringFieldUpdateOperationsInput | string
    position_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    view_count?: NullableIntFieldUpdateOperationsInput | number | null
    applied?: NullableBoolFieldUpdateOperationsInput | boolean | null
    apply_count?: NullableIntFieldUpdateOperationsInput | number | null
    create_time?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    work_type_id?: NullableIntFieldUpdateOperationsInput | number | null
    work_type_name?: NullableStringFieldUpdateOperationsInput | string | null
    office_mode_id?: NullableIntFieldUpdateOperationsInput | number | null
    office_mode_name?: NullableStringFieldUpdateOperationsInput | string | null
    company?: StringFieldUpdateOperationsInput | string
    company_introduction?: NullableStringFieldUpdateOperationsInput | string | null
    company_size_name?: NullableStringFieldUpdateOperationsInput | string | null
    company_logo?: NullableStringFieldUpdateOperationsInput | string | null
    company_website?: NullableStringFieldUpdateOperationsInput | string | null
    company_id?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    min_salary?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    max_salary?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    lever_id?: NullableIntFieldUpdateOperationsInput | number | null
    lever_name?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    base?: NullableStringFieldUpdateOperationsInput | string | null
    ffrom?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type job_tag_relationCreateInput = {
    topic_id: bigint | number
    tag_id: bigint | number
    ffrom?: string | null
  }

  export type job_tag_relationUncheckedCreateInput = {
    topic_id: bigint | number
    tag_id: bigint | number
    ffrom?: string | null
  }

  export type job_tag_relationUpdateInput = {
    topic_id?: BigIntFieldUpdateOperationsInput | bigint | number
    tag_id?: BigIntFieldUpdateOperationsInput | bigint | number
    ffrom?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type job_tag_relationUncheckedUpdateInput = {
    topic_id?: BigIntFieldUpdateOperationsInput | bigint | number
    tag_id?: BigIntFieldUpdateOperationsInput | bigint | number
    ffrom?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type job_tag_relationCreateManyInput = {
    topic_id: bigint | number
    tag_id: bigint | number
    ffrom?: string | null
  }

  export type job_tag_relationUpdateManyMutationInput = {
    topic_id?: BigIntFieldUpdateOperationsInput | bigint | number
    tag_id?: BigIntFieldUpdateOperationsInput | bigint | number
    ffrom?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type job_tag_relationUncheckedUpdateManyInput = {
    topic_id?: BigIntFieldUpdateOperationsInput | bigint | number
    tag_id?: BigIntFieldUpdateOperationsInput | bigint | number
    ffrom?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tagCreateInput = {
    tag_id: bigint | number
    tag_name: string
    ffrom?: string | null
  }

  export type tagUncheckedCreateInput = {
    tag_id: bigint | number
    tag_name: string
    ffrom?: string | null
  }

  export type tagUpdateInput = {
    tag_id?: BigIntFieldUpdateOperationsInput | bigint | number
    tag_name?: StringFieldUpdateOperationsInput | string
    ffrom?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tagUncheckedUpdateInput = {
    tag_id?: BigIntFieldUpdateOperationsInput | bigint | number
    tag_name?: StringFieldUpdateOperationsInput | string
    ffrom?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tagCreateManyInput = {
    tag_id: bigint | number
    tag_name: string
    ffrom?: string | null
  }

  export type tagUpdateManyMutationInput = {
    tag_id?: BigIntFieldUpdateOperationsInput | bigint | number
    tag_name?: StringFieldUpdateOperationsInput | string
    ffrom?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type tagUncheckedUpdateManyInput = {
    tag_id?: BigIntFieldUpdateOperationsInput | bigint | number
    tag_name?: StringFieldUpdateOperationsInput | string
    ffrom?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type user_infoCreateInput = {
    id: bigint | number
    nickname: string
    avatar?: string | null
    small_avatar?: string | null
    topic_count?: number | null
    comment_count?: number | null
    fans_count?: number | null
    follow_count?: number | null
    score?: number | null
    description?: string | null
    create_time?: bigint | number | null
    wallet_address?: string | null
    ffrom?: string | null
    followed?: boolean | null
  }

  export type user_infoUncheckedCreateInput = {
    id: bigint | number
    nickname: string
    avatar?: string | null
    small_avatar?: string | null
    topic_count?: number | null
    comment_count?: number | null
    fans_count?: number | null
    follow_count?: number | null
    score?: number | null
    description?: string | null
    create_time?: bigint | number | null
    wallet_address?: string | null
    ffrom?: string | null
    followed?: boolean | null
  }

  export type user_infoUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nickname?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    small_avatar?: NullableStringFieldUpdateOperationsInput | string | null
    topic_count?: NullableIntFieldUpdateOperationsInput | number | null
    comment_count?: NullableIntFieldUpdateOperationsInput | number | null
    fans_count?: NullableIntFieldUpdateOperationsInput | number | null
    follow_count?: NullableIntFieldUpdateOperationsInput | number | null
    score?: NullableIntFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    create_time?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    wallet_address?: NullableStringFieldUpdateOperationsInput | string | null
    ffrom?: NullableStringFieldUpdateOperationsInput | string | null
    followed?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type user_infoUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nickname?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    small_avatar?: NullableStringFieldUpdateOperationsInput | string | null
    topic_count?: NullableIntFieldUpdateOperationsInput | number | null
    comment_count?: NullableIntFieldUpdateOperationsInput | number | null
    fans_count?: NullableIntFieldUpdateOperationsInput | number | null
    follow_count?: NullableIntFieldUpdateOperationsInput | number | null
    score?: NullableIntFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    create_time?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    wallet_address?: NullableStringFieldUpdateOperationsInput | string | null
    ffrom?: NullableStringFieldUpdateOperationsInput | string | null
    followed?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type user_infoCreateManyInput = {
    id: bigint | number
    nickname: string
    avatar?: string | null
    small_avatar?: string | null
    topic_count?: number | null
    comment_count?: number | null
    fans_count?: number | null
    follow_count?: number | null
    score?: number | null
    description?: string | null
    create_time?: bigint | number | null
    wallet_address?: string | null
    ffrom?: string | null
    followed?: boolean | null
  }

  export type user_infoUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nickname?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    small_avatar?: NullableStringFieldUpdateOperationsInput | string | null
    topic_count?: NullableIntFieldUpdateOperationsInput | number | null
    comment_count?: NullableIntFieldUpdateOperationsInput | number | null
    fans_count?: NullableIntFieldUpdateOperationsInput | number | null
    follow_count?: NullableIntFieldUpdateOperationsInput | number | null
    score?: NullableIntFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    create_time?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    wallet_address?: NullableStringFieldUpdateOperationsInput | string | null
    ffrom?: NullableStringFieldUpdateOperationsInput | string | null
    followed?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type user_infoUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    nickname?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    small_avatar?: NullableStringFieldUpdateOperationsInput | string | null
    topic_count?: NullableIntFieldUpdateOperationsInput | number | null
    comment_count?: NullableIntFieldUpdateOperationsInput | number | null
    fans_count?: NullableIntFieldUpdateOperationsInput | number | null
    follow_count?: NullableIntFieldUpdateOperationsInput | number | null
    score?: NullableIntFieldUpdateOperationsInput | number | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    create_time?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    wallet_address?: NullableStringFieldUpdateOperationsInput | string | null
    ffrom?: NullableStringFieldUpdateOperationsInput | string | null
    followed?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type job_postingCountOrderByAggregateInput = {
    topic_id?: SortOrder
    content?: SortOrder
    content2?: SortOrder
    content3?: SortOrder
    content5?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    wechat?: SortOrder
    telegram?: SortOrder
    position_name?: SortOrder
    position_id?: SortOrder
    view_count?: SortOrder
    applied?: SortOrder
    apply_count?: SortOrder
    create_time?: SortOrder
    url?: SortOrder
    work_type_id?: SortOrder
    work_type_name?: SortOrder
    office_mode_id?: SortOrder
    office_mode_name?: SortOrder
    company?: SortOrder
    company_introduction?: SortOrder
    company_size_name?: SortOrder
    company_logo?: SortOrder
    company_website?: SortOrder
    company_id?: SortOrder
    min_salary?: SortOrder
    max_salary?: SortOrder
    lever_id?: SortOrder
    lever_name?: SortOrder
    location?: SortOrder
    base?: SortOrder
    ffrom?: SortOrder
    status?: SortOrder
  }

  export type job_postingAvgOrderByAggregateInput = {
    topic_id?: SortOrder
    position_id?: SortOrder
    view_count?: SortOrder
    apply_count?: SortOrder
    create_time?: SortOrder
    work_type_id?: SortOrder
    office_mode_id?: SortOrder
    company_id?: SortOrder
    min_salary?: SortOrder
    max_salary?: SortOrder
    lever_id?: SortOrder
    status?: SortOrder
  }

  export type job_postingMaxOrderByAggregateInput = {
    topic_id?: SortOrder
    content?: SortOrder
    content2?: SortOrder
    content3?: SortOrder
    content5?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    wechat?: SortOrder
    telegram?: SortOrder
    position_name?: SortOrder
    position_id?: SortOrder
    view_count?: SortOrder
    applied?: SortOrder
    apply_count?: SortOrder
    create_time?: SortOrder
    url?: SortOrder
    work_type_id?: SortOrder
    work_type_name?: SortOrder
    office_mode_id?: SortOrder
    office_mode_name?: SortOrder
    company?: SortOrder
    company_introduction?: SortOrder
    company_size_name?: SortOrder
    company_logo?: SortOrder
    company_website?: SortOrder
    company_id?: SortOrder
    min_salary?: SortOrder
    max_salary?: SortOrder
    lever_id?: SortOrder
    lever_name?: SortOrder
    location?: SortOrder
    base?: SortOrder
    ffrom?: SortOrder
    status?: SortOrder
  }

  export type job_postingMinOrderByAggregateInput = {
    topic_id?: SortOrder
    content?: SortOrder
    content2?: SortOrder
    content3?: SortOrder
    content5?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    wechat?: SortOrder
    telegram?: SortOrder
    position_name?: SortOrder
    position_id?: SortOrder
    view_count?: SortOrder
    applied?: SortOrder
    apply_count?: SortOrder
    create_time?: SortOrder
    url?: SortOrder
    work_type_id?: SortOrder
    work_type_name?: SortOrder
    office_mode_id?: SortOrder
    office_mode_name?: SortOrder
    company?: SortOrder
    company_introduction?: SortOrder
    company_size_name?: SortOrder
    company_logo?: SortOrder
    company_website?: SortOrder
    company_id?: SortOrder
    min_salary?: SortOrder
    max_salary?: SortOrder
    lever_id?: SortOrder
    lever_name?: SortOrder
    location?: SortOrder
    base?: SortOrder
    ffrom?: SortOrder
    status?: SortOrder
  }

  export type job_postingSumOrderByAggregateInput = {
    topic_id?: SortOrder
    position_id?: SortOrder
    view_count?: SortOrder
    apply_count?: SortOrder
    create_time?: SortOrder
    work_type_id?: SortOrder
    office_mode_id?: SortOrder
    company_id?: SortOrder
    min_salary?: SortOrder
    max_salary?: SortOrder
    lever_id?: SortOrder
    status?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type job_tag_relationTopic_idTag_idCompoundUniqueInput = {
    topic_id: bigint | number
    tag_id: bigint | number
  }

  export type job_tag_relationCountOrderByAggregateInput = {
    topic_id?: SortOrder
    tag_id?: SortOrder
    ffrom?: SortOrder
  }

  export type job_tag_relationAvgOrderByAggregateInput = {
    topic_id?: SortOrder
    tag_id?: SortOrder
  }

  export type job_tag_relationMaxOrderByAggregateInput = {
    topic_id?: SortOrder
    tag_id?: SortOrder
    ffrom?: SortOrder
  }

  export type job_tag_relationMinOrderByAggregateInput = {
    topic_id?: SortOrder
    tag_id?: SortOrder
    ffrom?: SortOrder
  }

  export type job_tag_relationSumOrderByAggregateInput = {
    topic_id?: SortOrder
    tag_id?: SortOrder
  }

  export type tagCountOrderByAggregateInput = {
    tag_id?: SortOrder
    tag_name?: SortOrder
    ffrom?: SortOrder
  }

  export type tagAvgOrderByAggregateInput = {
    tag_id?: SortOrder
  }

  export type tagMaxOrderByAggregateInput = {
    tag_id?: SortOrder
    tag_name?: SortOrder
    ffrom?: SortOrder
  }

  export type tagMinOrderByAggregateInput = {
    tag_id?: SortOrder
    tag_name?: SortOrder
    ffrom?: SortOrder
  }

  export type tagSumOrderByAggregateInput = {
    tag_id?: SortOrder
  }

  export type user_infoCountOrderByAggregateInput = {
    id?: SortOrder
    nickname?: SortOrder
    avatar?: SortOrder
    small_avatar?: SortOrder
    topic_count?: SortOrder
    comment_count?: SortOrder
    fans_count?: SortOrder
    follow_count?: SortOrder
    score?: SortOrder
    description?: SortOrder
    create_time?: SortOrder
    wallet_address?: SortOrder
    ffrom?: SortOrder
    followed?: SortOrder
  }

  export type user_infoAvgOrderByAggregateInput = {
    id?: SortOrder
    topic_count?: SortOrder
    comment_count?: SortOrder
    fans_count?: SortOrder
    follow_count?: SortOrder
    score?: SortOrder
    create_time?: SortOrder
  }

  export type user_infoMaxOrderByAggregateInput = {
    id?: SortOrder
    nickname?: SortOrder
    avatar?: SortOrder
    small_avatar?: SortOrder
    topic_count?: SortOrder
    comment_count?: SortOrder
    fans_count?: SortOrder
    follow_count?: SortOrder
    score?: SortOrder
    description?: SortOrder
    create_time?: SortOrder
    wallet_address?: SortOrder
    ffrom?: SortOrder
    followed?: SortOrder
  }

  export type user_infoMinOrderByAggregateInput = {
    id?: SortOrder
    nickname?: SortOrder
    avatar?: SortOrder
    small_avatar?: SortOrder
    topic_count?: SortOrder
    comment_count?: SortOrder
    fans_count?: SortOrder
    follow_count?: SortOrder
    score?: SortOrder
    description?: SortOrder
    create_time?: SortOrder
    wallet_address?: SortOrder
    ffrom?: SortOrder
    followed?: SortOrder
  }

  export type user_infoSumOrderByAggregateInput = {
    id?: SortOrder
    topic_count?: SortOrder
    comment_count?: SortOrder
    fans_count?: SortOrder
    follow_count?: SortOrder
    score?: SortOrder
    create_time?: SortOrder
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableBigIntFieldUpdateOperationsInput = {
    set?: bigint | number | null
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedBigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use job_postingDefaultArgs instead
     */
    export type job_postingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = job_postingDefaultArgs<ExtArgs>
    /**
     * @deprecated Use job_tag_relationDefaultArgs instead
     */
    export type job_tag_relationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = job_tag_relationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use tagDefaultArgs instead
     */
    export type tagArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = tagDefaultArgs<ExtArgs>
    /**
     * @deprecated Use user_infoDefaultArgs instead
     */
    export type user_infoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = user_infoDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}