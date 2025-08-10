
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
 * Model User
 * 用户表，记录所有注册用户的钱包地址及基础信息
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Job
 * 岗位表，记录所有招聘岗位信息
 */
export type Job = $Result.DefaultSelection<Prisma.$JobPayload>
/**
 * Model Resume
 * 简历表，记录用户上传的简历
 */
export type Resume = $Result.DefaultSelection<Prisma.$ResumePayload>
/**
 * Model ResumeAnalysis
 * 简历分析表，记录简历与岗位的匹配分析结果
 */
export type ResumeAnalysis = $Result.DefaultSelection<Prisma.$ResumeAnalysisPayload>
/**
 * Model Application
 * 投递记录表，记录用户对岗位的投递行为
 */
export type Application = $Result.DefaultSelection<Prisma.$ApplicationPayload>
/**
 * Model NFTProof
 * NFT证明表，记录用户的链上成就/组织等证明
 */
export type NFTProof = $Result.DefaultSelection<Prisma.$NFTProofPayload>
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
 * Model job_user_relation
 * 
 */
export type job_user_relation = $Result.DefaultSelection<Prisma.$job_user_relationPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
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
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
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
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.job`: Exposes CRUD operations for the **Job** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Jobs
    * const jobs = await prisma.job.findMany()
    * ```
    */
  get job(): Prisma.JobDelegate<ExtArgs>;

  /**
   * `prisma.resume`: Exposes CRUD operations for the **Resume** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Resumes
    * const resumes = await prisma.resume.findMany()
    * ```
    */
  get resume(): Prisma.ResumeDelegate<ExtArgs>;

  /**
   * `prisma.resumeAnalysis`: Exposes CRUD operations for the **ResumeAnalysis** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ResumeAnalyses
    * const resumeAnalyses = await prisma.resumeAnalysis.findMany()
    * ```
    */
  get resumeAnalysis(): Prisma.ResumeAnalysisDelegate<ExtArgs>;

  /**
   * `prisma.application`: Exposes CRUD operations for the **Application** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Applications
    * const applications = await prisma.application.findMany()
    * ```
    */
  get application(): Prisma.ApplicationDelegate<ExtArgs>;

  /**
   * `prisma.nFTProof`: Exposes CRUD operations for the **NFTProof** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NFTProofs
    * const nFTProofs = await prisma.nFTProof.findMany()
    * ```
    */
  get nFTProof(): Prisma.NFTProofDelegate<ExtArgs>;

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

  /**
   * `prisma.job_user_relation`: Exposes CRUD operations for the **job_user_relation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Job_user_relations
    * const job_user_relations = await prisma.job_user_relation.findMany()
    * ```
    */
  get job_user_relation(): Prisma.job_user_relationDelegate<ExtArgs>;
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
    User: 'User',
    Job: 'Job',
    Resume: 'Resume',
    ResumeAnalysis: 'ResumeAnalysis',
    Application: 'Application',
    NFTProof: 'NFTProof',
    job_posting: 'job_posting',
    job_tag_relation: 'job_tag_relation',
    tag: 'tag',
    user_info: 'user_info',
    job_user_relation: 'job_user_relation'
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
      modelProps: "user" | "job" | "resume" | "resumeAnalysis" | "application" | "nFTProof" | "job_posting" | "job_tag_relation" | "tag" | "user_info" | "job_user_relation"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Job: {
        payload: Prisma.$JobPayload<ExtArgs>
        fields: Prisma.JobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.JobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.JobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          findFirst: {
            args: Prisma.JobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.JobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          findMany: {
            args: Prisma.JobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>[]
          }
          create: {
            args: Prisma.JobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          createMany: {
            args: Prisma.JobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.JobCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>[]
          }
          delete: {
            args: Prisma.JobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          update: {
            args: Prisma.JobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          deleteMany: {
            args: Prisma.JobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.JobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.JobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$JobPayload>
          }
          aggregate: {
            args: Prisma.JobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJob>
          }
          groupBy: {
            args: Prisma.JobGroupByArgs<ExtArgs>
            result: $Utils.Optional<JobGroupByOutputType>[]
          }
          count: {
            args: Prisma.JobCountArgs<ExtArgs>
            result: $Utils.Optional<JobCountAggregateOutputType> | number
          }
        }
      }
      Resume: {
        payload: Prisma.$ResumePayload<ExtArgs>
        fields: Prisma.ResumeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ResumeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ResumeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          findFirst: {
            args: Prisma.ResumeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ResumeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          findMany: {
            args: Prisma.ResumeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>[]
          }
          create: {
            args: Prisma.ResumeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          createMany: {
            args: Prisma.ResumeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ResumeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>[]
          }
          delete: {
            args: Prisma.ResumeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          update: {
            args: Prisma.ResumeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          deleteMany: {
            args: Prisma.ResumeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ResumeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ResumeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumePayload>
          }
          aggregate: {
            args: Prisma.ResumeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateResume>
          }
          groupBy: {
            args: Prisma.ResumeGroupByArgs<ExtArgs>
            result: $Utils.Optional<ResumeGroupByOutputType>[]
          }
          count: {
            args: Prisma.ResumeCountArgs<ExtArgs>
            result: $Utils.Optional<ResumeCountAggregateOutputType> | number
          }
        }
      }
      ResumeAnalysis: {
        payload: Prisma.$ResumeAnalysisPayload<ExtArgs>
        fields: Prisma.ResumeAnalysisFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ResumeAnalysisFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumeAnalysisPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ResumeAnalysisFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumeAnalysisPayload>
          }
          findFirst: {
            args: Prisma.ResumeAnalysisFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumeAnalysisPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ResumeAnalysisFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumeAnalysisPayload>
          }
          findMany: {
            args: Prisma.ResumeAnalysisFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumeAnalysisPayload>[]
          }
          create: {
            args: Prisma.ResumeAnalysisCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumeAnalysisPayload>
          }
          createMany: {
            args: Prisma.ResumeAnalysisCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ResumeAnalysisCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumeAnalysisPayload>[]
          }
          delete: {
            args: Prisma.ResumeAnalysisDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumeAnalysisPayload>
          }
          update: {
            args: Prisma.ResumeAnalysisUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumeAnalysisPayload>
          }
          deleteMany: {
            args: Prisma.ResumeAnalysisDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ResumeAnalysisUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ResumeAnalysisUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResumeAnalysisPayload>
          }
          aggregate: {
            args: Prisma.ResumeAnalysisAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateResumeAnalysis>
          }
          groupBy: {
            args: Prisma.ResumeAnalysisGroupByArgs<ExtArgs>
            result: $Utils.Optional<ResumeAnalysisGroupByOutputType>[]
          }
          count: {
            args: Prisma.ResumeAnalysisCountArgs<ExtArgs>
            result: $Utils.Optional<ResumeAnalysisCountAggregateOutputType> | number
          }
        }
      }
      Application: {
        payload: Prisma.$ApplicationPayload<ExtArgs>
        fields: Prisma.ApplicationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ApplicationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ApplicationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          findFirst: {
            args: Prisma.ApplicationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ApplicationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          findMany: {
            args: Prisma.ApplicationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>[]
          }
          create: {
            args: Prisma.ApplicationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          createMany: {
            args: Prisma.ApplicationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ApplicationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>[]
          }
          delete: {
            args: Prisma.ApplicationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          update: {
            args: Prisma.ApplicationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          deleteMany: {
            args: Prisma.ApplicationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ApplicationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ApplicationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          aggregate: {
            args: Prisma.ApplicationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateApplication>
          }
          groupBy: {
            args: Prisma.ApplicationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ApplicationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ApplicationCountArgs<ExtArgs>
            result: $Utils.Optional<ApplicationCountAggregateOutputType> | number
          }
        }
      }
      NFTProof: {
        payload: Prisma.$NFTProofPayload<ExtArgs>
        fields: Prisma.NFTProofFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NFTProofFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NFTProofPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NFTProofFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NFTProofPayload>
          }
          findFirst: {
            args: Prisma.NFTProofFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NFTProofPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NFTProofFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NFTProofPayload>
          }
          findMany: {
            args: Prisma.NFTProofFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NFTProofPayload>[]
          }
          create: {
            args: Prisma.NFTProofCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NFTProofPayload>
          }
          createMany: {
            args: Prisma.NFTProofCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NFTProofCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NFTProofPayload>[]
          }
          delete: {
            args: Prisma.NFTProofDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NFTProofPayload>
          }
          update: {
            args: Prisma.NFTProofUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NFTProofPayload>
          }
          deleteMany: {
            args: Prisma.NFTProofDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NFTProofUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NFTProofUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NFTProofPayload>
          }
          aggregate: {
            args: Prisma.NFTProofAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNFTProof>
          }
          groupBy: {
            args: Prisma.NFTProofGroupByArgs<ExtArgs>
            result: $Utils.Optional<NFTProofGroupByOutputType>[]
          }
          count: {
            args: Prisma.NFTProofCountArgs<ExtArgs>
            result: $Utils.Optional<NFTProofCountAggregateOutputType> | number
          }
        }
      }
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
      job_user_relation: {
        payload: Prisma.$job_user_relationPayload<ExtArgs>
        fields: Prisma.job_user_relationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.job_user_relationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_user_relationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.job_user_relationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_user_relationPayload>
          }
          findFirst: {
            args: Prisma.job_user_relationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_user_relationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.job_user_relationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_user_relationPayload>
          }
          findMany: {
            args: Prisma.job_user_relationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_user_relationPayload>[]
          }
          create: {
            args: Prisma.job_user_relationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_user_relationPayload>
          }
          createMany: {
            args: Prisma.job_user_relationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.job_user_relationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_user_relationPayload>[]
          }
          delete: {
            args: Prisma.job_user_relationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_user_relationPayload>
          }
          update: {
            args: Prisma.job_user_relationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_user_relationPayload>
          }
          deleteMany: {
            args: Prisma.job_user_relationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.job_user_relationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.job_user_relationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$job_user_relationPayload>
          }
          aggregate: {
            args: Prisma.Job_user_relationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateJob_user_relation>
          }
          groupBy: {
            args: Prisma.job_user_relationGroupByArgs<ExtArgs>
            result: $Utils.Optional<Job_user_relationGroupByOutputType>[]
          }
          count: {
            args: Prisma.job_user_relationCountArgs<ExtArgs>
            result: $Utils.Optional<Job_user_relationCountAggregateOutputType> | number
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
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    applications: number
    nftProofs: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | UserCountOutputTypeCountApplicationsArgs
    nftProofs?: boolean | UserCountOutputTypeCountNftProofsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApplicationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountNftProofsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NFTProofWhereInput
  }


  /**
   * Count Type JobCountOutputType
   */

  export type JobCountOutputType = {
    applications: number
    resumeAnalyses: number
  }

  export type JobCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | JobCountOutputTypeCountApplicationsArgs
    resumeAnalyses?: boolean | JobCountOutputTypeCountResumeAnalysesArgs
  }

  // Custom InputTypes
  /**
   * JobCountOutputType without action
   */
  export type JobCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the JobCountOutputType
     */
    select?: JobCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * JobCountOutputType without action
   */
  export type JobCountOutputTypeCountApplicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApplicationWhereInput
  }

  /**
   * JobCountOutputType without action
   */
  export type JobCountOutputTypeCountResumeAnalysesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResumeAnalysisWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    address: string | null
    nickname: string | null
    email: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    address: string | null
    nickname: string | null
    email: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    address: number
    nickname: number
    email: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    address?: true
    nickname?: true
    email?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    address?: true
    nickname?: true
    email?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    address?: true
    nickname?: true
    email?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    address: string
    nickname: string | null
    email: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    address?: boolean
    nickname?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    applications?: boolean | User$applicationsArgs<ExtArgs>
    nftProofs?: boolean | User$nftProofsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    address?: boolean
    nickname?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    address?: boolean
    nickname?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | User$applicationsArgs<ExtArgs>
    nftProofs?: boolean | User$nftProofsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      applications: Prisma.$ApplicationPayload<ExtArgs>[]
      nftProofs: Prisma.$NFTProofPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      address: string
      nickname: string | null
      email: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
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
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    applications<T extends User$applicationsArgs<ExtArgs> = {}>(args?: Subset<T, User$applicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findMany"> | Null>
    nftProofs<T extends User$nftProofsArgs<ExtArgs> = {}>(args?: Subset<T, User$nftProofsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NFTProofPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly address: FieldRef<"User", 'String'>
    readonly nickname: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.applications
   */
  export type User$applicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    where?: ApplicationWhereInput
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    cursor?: ApplicationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * User.nftProofs
   */
  export type User$nftProofsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NFTProof
     */
    select?: NFTProofSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NFTProofInclude<ExtArgs> | null
    where?: NFTProofWhereInput
    orderBy?: NFTProofOrderByWithRelationInput | NFTProofOrderByWithRelationInput[]
    cursor?: NFTProofWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NFTProofScalarFieldEnum | NFTProofScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Job
   */

  export type AggregateJob = {
    _count: JobCountAggregateOutputType | null
    _min: JobMinAggregateOutputType | null
    _max: JobMaxAggregateOutputType | null
  }

  export type JobMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    jobType: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type JobMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    jobType: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type JobCountAggregateOutputType = {
    id: number
    title: number
    description: number
    jobType: number
    weights: number
    parsedRequirements: number
    vectorMetadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type JobMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    jobType?: true
    createdAt?: true
    updatedAt?: true
  }

  export type JobMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    jobType?: true
    createdAt?: true
    updatedAt?: true
  }

  export type JobCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    jobType?: true
    weights?: true
    parsedRequirements?: true
    vectorMetadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type JobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Job to aggregate.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Jobs
    **/
    _count?: true | JobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: JobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: JobMaxAggregateInputType
  }

  export type GetJobAggregateType<T extends JobAggregateArgs> = {
        [P in keyof T & keyof AggregateJob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJob[P]>
      : GetScalarType<T[P], AggregateJob[P]>
  }




  export type JobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: JobWhereInput
    orderBy?: JobOrderByWithAggregationInput | JobOrderByWithAggregationInput[]
    by: JobScalarFieldEnum[] | JobScalarFieldEnum
    having?: JobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: JobCountAggregateInputType | true
    _min?: JobMinAggregateInputType
    _max?: JobMaxAggregateInputType
  }

  export type JobGroupByOutputType = {
    id: string
    title: string
    description: string
    jobType: string
    weights: JsonValue
    parsedRequirements: JsonValue
    vectorMetadata: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: JobCountAggregateOutputType | null
    _min: JobMinAggregateOutputType | null
    _max: JobMaxAggregateOutputType | null
  }

  type GetJobGroupByPayload<T extends JobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<JobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof JobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], JobGroupByOutputType[P]>
            : GetScalarType<T[P], JobGroupByOutputType[P]>
        }
      >
    >


  export type JobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    jobType?: boolean
    weights?: boolean
    parsedRequirements?: boolean
    vectorMetadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    applications?: boolean | Job$applicationsArgs<ExtArgs>
    resumeAnalyses?: boolean | Job$resumeAnalysesArgs<ExtArgs>
    _count?: boolean | JobCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["job"]>

  export type JobSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    jobType?: boolean
    weights?: boolean
    parsedRequirements?: boolean
    vectorMetadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["job"]>

  export type JobSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    jobType?: boolean
    weights?: boolean
    parsedRequirements?: boolean
    vectorMetadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type JobInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    applications?: boolean | Job$applicationsArgs<ExtArgs>
    resumeAnalyses?: boolean | Job$resumeAnalysesArgs<ExtArgs>
    _count?: boolean | JobCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type JobIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $JobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Job"
    objects: {
      applications: Prisma.$ApplicationPayload<ExtArgs>[]
      resumeAnalyses: Prisma.$ResumeAnalysisPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string
      jobType: string
      weights: Prisma.JsonValue
      parsedRequirements: Prisma.JsonValue
      vectorMetadata: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["job"]>
    composites: {}
  }

  type JobGetPayload<S extends boolean | null | undefined | JobDefaultArgs> = $Result.GetResult<Prisma.$JobPayload, S>

  type JobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<JobFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: JobCountAggregateInputType | true
    }

  export interface JobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Job'], meta: { name: 'Job' } }
    /**
     * Find zero or one Job that matches the filter.
     * @param {JobFindUniqueArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends JobFindUniqueArgs>(args: SelectSubset<T, JobFindUniqueArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Job that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {JobFindUniqueOrThrowArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends JobFindUniqueOrThrowArgs>(args: SelectSubset<T, JobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Job that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobFindFirstArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends JobFindFirstArgs>(args?: SelectSubset<T, JobFindFirstArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Job that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobFindFirstOrThrowArgs} args - Arguments to find a Job
     * @example
     * // Get one Job
     * const job = await prisma.job.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends JobFindFirstOrThrowArgs>(args?: SelectSubset<T, JobFindFirstOrThrowArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Jobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Jobs
     * const jobs = await prisma.job.findMany()
     * 
     * // Get first 10 Jobs
     * const jobs = await prisma.job.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const jobWithIdOnly = await prisma.job.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends JobFindManyArgs>(args?: SelectSubset<T, JobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Job.
     * @param {JobCreateArgs} args - Arguments to create a Job.
     * @example
     * // Create one Job
     * const Job = await prisma.job.create({
     *   data: {
     *     // ... data to create a Job
     *   }
     * })
     * 
     */
    create<T extends JobCreateArgs>(args: SelectSubset<T, JobCreateArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Jobs.
     * @param {JobCreateManyArgs} args - Arguments to create many Jobs.
     * @example
     * // Create many Jobs
     * const job = await prisma.job.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends JobCreateManyArgs>(args?: SelectSubset<T, JobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Jobs and returns the data saved in the database.
     * @param {JobCreateManyAndReturnArgs} args - Arguments to create many Jobs.
     * @example
     * // Create many Jobs
     * const job = await prisma.job.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Jobs and only return the `id`
     * const jobWithIdOnly = await prisma.job.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends JobCreateManyAndReturnArgs>(args?: SelectSubset<T, JobCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Job.
     * @param {JobDeleteArgs} args - Arguments to delete one Job.
     * @example
     * // Delete one Job
     * const Job = await prisma.job.delete({
     *   where: {
     *     // ... filter to delete one Job
     *   }
     * })
     * 
     */
    delete<T extends JobDeleteArgs>(args: SelectSubset<T, JobDeleteArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Job.
     * @param {JobUpdateArgs} args - Arguments to update one Job.
     * @example
     * // Update one Job
     * const job = await prisma.job.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends JobUpdateArgs>(args: SelectSubset<T, JobUpdateArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Jobs.
     * @param {JobDeleteManyArgs} args - Arguments to filter Jobs to delete.
     * @example
     * // Delete a few Jobs
     * const { count } = await prisma.job.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends JobDeleteManyArgs>(args?: SelectSubset<T, JobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Jobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Jobs
     * const job = await prisma.job.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends JobUpdateManyArgs>(args: SelectSubset<T, JobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Job.
     * @param {JobUpsertArgs} args - Arguments to update or create a Job.
     * @example
     * // Update or create a Job
     * const job = await prisma.job.upsert({
     *   create: {
     *     // ... data to create a Job
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Job we want to update
     *   }
     * })
     */
    upsert<T extends JobUpsertArgs>(args: SelectSubset<T, JobUpsertArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Jobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobCountArgs} args - Arguments to filter Jobs to count.
     * @example
     * // Count the number of Jobs
     * const count = await prisma.job.count({
     *   where: {
     *     // ... the filter for the Jobs we want to count
     *   }
     * })
    **/
    count<T extends JobCountArgs>(
      args?: Subset<T, JobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], JobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Job.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends JobAggregateArgs>(args: Subset<T, JobAggregateArgs>): Prisma.PrismaPromise<GetJobAggregateType<T>>

    /**
     * Group by Job.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {JobGroupByArgs} args - Group by arguments.
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
      T extends JobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: JobGroupByArgs['orderBy'] }
        : { orderBy?: JobGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, JobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Job model
   */
  readonly fields: JobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Job.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__JobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    applications<T extends Job$applicationsArgs<ExtArgs> = {}>(args?: Subset<T, Job$applicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findMany"> | Null>
    resumeAnalyses<T extends Job$resumeAnalysesArgs<ExtArgs> = {}>(args?: Subset<T, Job$resumeAnalysesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumeAnalysisPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Job model
   */ 
  interface JobFieldRefs {
    readonly id: FieldRef<"Job", 'String'>
    readonly title: FieldRef<"Job", 'String'>
    readonly description: FieldRef<"Job", 'String'>
    readonly jobType: FieldRef<"Job", 'String'>
    readonly weights: FieldRef<"Job", 'Json'>
    readonly parsedRequirements: FieldRef<"Job", 'Json'>
    readonly vectorMetadata: FieldRef<"Job", 'Json'>
    readonly createdAt: FieldRef<"Job", 'DateTime'>
    readonly updatedAt: FieldRef<"Job", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Job findUnique
   */
  export type JobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job findUniqueOrThrow
   */
  export type JobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job findFirst
   */
  export type JobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Jobs.
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Jobs.
     */
    distinct?: JobScalarFieldEnum | JobScalarFieldEnum[]
  }

  /**
   * Job findFirstOrThrow
   */
  export type JobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Job to fetch.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Jobs.
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Jobs.
     */
    distinct?: JobScalarFieldEnum | JobScalarFieldEnum[]
  }

  /**
   * Job findMany
   */
  export type JobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter, which Jobs to fetch.
     */
    where?: JobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Jobs to fetch.
     */
    orderBy?: JobOrderByWithRelationInput | JobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Jobs.
     */
    cursor?: JobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Jobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Jobs.
     */
    skip?: number
    distinct?: JobScalarFieldEnum | JobScalarFieldEnum[]
  }

  /**
   * Job create
   */
  export type JobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * The data needed to create a Job.
     */
    data: XOR<JobCreateInput, JobUncheckedCreateInput>
  }

  /**
   * Job createMany
   */
  export type JobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Jobs.
     */
    data: JobCreateManyInput | JobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Job createManyAndReturn
   */
  export type JobCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Jobs.
     */
    data: JobCreateManyInput | JobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Job update
   */
  export type JobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * The data needed to update a Job.
     */
    data: XOR<JobUpdateInput, JobUncheckedUpdateInput>
    /**
     * Choose, which Job to update.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job updateMany
   */
  export type JobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Jobs.
     */
    data: XOR<JobUpdateManyMutationInput, JobUncheckedUpdateManyInput>
    /**
     * Filter which Jobs to update
     */
    where?: JobWhereInput
  }

  /**
   * Job upsert
   */
  export type JobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * The filter to search for the Job to update in case it exists.
     */
    where: JobWhereUniqueInput
    /**
     * In case the Job found by the `where` argument doesn't exist, create a new Job with this data.
     */
    create: XOR<JobCreateInput, JobUncheckedCreateInput>
    /**
     * In case the Job was found with the provided `where` argument, update it with this data.
     */
    update: XOR<JobUpdateInput, JobUncheckedUpdateInput>
  }

  /**
   * Job delete
   */
  export type JobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
    /**
     * Filter which Job to delete.
     */
    where: JobWhereUniqueInput
  }

  /**
   * Job deleteMany
   */
  export type JobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Jobs to delete
     */
    where?: JobWhereInput
  }

  /**
   * Job.applications
   */
  export type Job$applicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    where?: ApplicationWhereInput
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    cursor?: ApplicationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Job.resumeAnalyses
   */
  export type Job$resumeAnalysesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeAnalysis
     */
    select?: ResumeAnalysisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeAnalysisInclude<ExtArgs> | null
    where?: ResumeAnalysisWhereInput
    orderBy?: ResumeAnalysisOrderByWithRelationInput | ResumeAnalysisOrderByWithRelationInput[]
    cursor?: ResumeAnalysisWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ResumeAnalysisScalarFieldEnum | ResumeAnalysisScalarFieldEnum[]
  }

  /**
   * Job without action
   */
  export type JobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Job
     */
    select?: JobSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: JobInclude<ExtArgs> | null
  }


  /**
   * Model Resume
   */

  export type AggregateResume = {
    _count: ResumeCountAggregateOutputType | null
    _avg: ResumeAvgAggregateOutputType | null
    _sum: ResumeSumAggregateOutputType | null
    _min: ResumeMinAggregateOutputType | null
    _max: ResumeMaxAggregateOutputType | null
  }

  export type ResumeAvgAggregateOutputType = {
    filesize: number | null
  }

  export type ResumeSumAggregateOutputType = {
    filesize: number | null
  }

  export type ResumeMinAggregateOutputType = {
    id: string | null
    userId: string | null
    content: string | null
    title: string | null
    filename: string | null
    filetype: string | null
    filesize: number | null
    vectorId: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ResumeMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    content: string | null
    title: string | null
    filename: string | null
    filetype: string | null
    filesize: number | null
    vectorId: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ResumeCountAggregateOutputType = {
    id: number
    userId: number
    content: number
    title: number
    filename: number
    filetype: number
    filesize: number
    parsedData: number
    vectorId: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ResumeAvgAggregateInputType = {
    filesize?: true
  }

  export type ResumeSumAggregateInputType = {
    filesize?: true
  }

  export type ResumeMinAggregateInputType = {
    id?: true
    userId?: true
    content?: true
    title?: true
    filename?: true
    filetype?: true
    filesize?: true
    vectorId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ResumeMaxAggregateInputType = {
    id?: true
    userId?: true
    content?: true
    title?: true
    filename?: true
    filetype?: true
    filesize?: true
    vectorId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ResumeCountAggregateInputType = {
    id?: true
    userId?: true
    content?: true
    title?: true
    filename?: true
    filetype?: true
    filesize?: true
    parsedData?: true
    vectorId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ResumeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Resume to aggregate.
     */
    where?: ResumeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resumes to fetch.
     */
    orderBy?: ResumeOrderByWithRelationInput | ResumeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ResumeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resumes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resumes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Resumes
    **/
    _count?: true | ResumeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ResumeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ResumeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ResumeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ResumeMaxAggregateInputType
  }

  export type GetResumeAggregateType<T extends ResumeAggregateArgs> = {
        [P in keyof T & keyof AggregateResume]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateResume[P]>
      : GetScalarType<T[P], AggregateResume[P]>
  }




  export type ResumeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResumeWhereInput
    orderBy?: ResumeOrderByWithAggregationInput | ResumeOrderByWithAggregationInput[]
    by: ResumeScalarFieldEnum[] | ResumeScalarFieldEnum
    having?: ResumeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ResumeCountAggregateInputType | true
    _avg?: ResumeAvgAggregateInputType
    _sum?: ResumeSumAggregateInputType
    _min?: ResumeMinAggregateInputType
    _max?: ResumeMaxAggregateInputType
  }

  export type ResumeGroupByOutputType = {
    id: string
    userId: string
    content: string
    title: string | null
    filename: string | null
    filetype: string | null
    filesize: number | null
    parsedData: JsonValue | null
    vectorId: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
    _count: ResumeCountAggregateOutputType | null
    _avg: ResumeAvgAggregateOutputType | null
    _sum: ResumeSumAggregateOutputType | null
    _min: ResumeMinAggregateOutputType | null
    _max: ResumeMaxAggregateOutputType | null
  }

  type GetResumeGroupByPayload<T extends ResumeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ResumeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ResumeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ResumeGroupByOutputType[P]>
            : GetScalarType<T[P], ResumeGroupByOutputType[P]>
        }
      >
    >


  export type ResumeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    content?: boolean
    title?: boolean
    filename?: boolean
    filetype?: boolean
    filesize?: boolean
    parsedData?: boolean
    vectorId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["resume"]>

  export type ResumeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    content?: boolean
    title?: boolean
    filename?: boolean
    filetype?: boolean
    filesize?: boolean
    parsedData?: boolean
    vectorId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["resume"]>

  export type ResumeSelectScalar = {
    id?: boolean
    userId?: boolean
    content?: boolean
    title?: boolean
    filename?: boolean
    filetype?: boolean
    filesize?: boolean
    parsedData?: boolean
    vectorId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $ResumePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Resume"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      content: string
      title: string | null
      filename: string | null
      filetype: string | null
      filesize: number | null
      parsedData: Prisma.JsonValue | null
      vectorId: string | null
      status: string | null
      createdAt: Date | null
      updatedAt: Date | null
    }, ExtArgs["result"]["resume"]>
    composites: {}
  }

  type ResumeGetPayload<S extends boolean | null | undefined | ResumeDefaultArgs> = $Result.GetResult<Prisma.$ResumePayload, S>

  type ResumeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ResumeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ResumeCountAggregateInputType | true
    }

  export interface ResumeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Resume'], meta: { name: 'Resume' } }
    /**
     * Find zero or one Resume that matches the filter.
     * @param {ResumeFindUniqueArgs} args - Arguments to find a Resume
     * @example
     * // Get one Resume
     * const resume = await prisma.resume.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ResumeFindUniqueArgs>(args: SelectSubset<T, ResumeFindUniqueArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Resume that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ResumeFindUniqueOrThrowArgs} args - Arguments to find a Resume
     * @example
     * // Get one Resume
     * const resume = await prisma.resume.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ResumeFindUniqueOrThrowArgs>(args: SelectSubset<T, ResumeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Resume that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeFindFirstArgs} args - Arguments to find a Resume
     * @example
     * // Get one Resume
     * const resume = await prisma.resume.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ResumeFindFirstArgs>(args?: SelectSubset<T, ResumeFindFirstArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Resume that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeFindFirstOrThrowArgs} args - Arguments to find a Resume
     * @example
     * // Get one Resume
     * const resume = await prisma.resume.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ResumeFindFirstOrThrowArgs>(args?: SelectSubset<T, ResumeFindFirstOrThrowArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Resumes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Resumes
     * const resumes = await prisma.resume.findMany()
     * 
     * // Get first 10 Resumes
     * const resumes = await prisma.resume.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const resumeWithIdOnly = await prisma.resume.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ResumeFindManyArgs>(args?: SelectSubset<T, ResumeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Resume.
     * @param {ResumeCreateArgs} args - Arguments to create a Resume.
     * @example
     * // Create one Resume
     * const Resume = await prisma.resume.create({
     *   data: {
     *     // ... data to create a Resume
     *   }
     * })
     * 
     */
    create<T extends ResumeCreateArgs>(args: SelectSubset<T, ResumeCreateArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Resumes.
     * @param {ResumeCreateManyArgs} args - Arguments to create many Resumes.
     * @example
     * // Create many Resumes
     * const resume = await prisma.resume.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ResumeCreateManyArgs>(args?: SelectSubset<T, ResumeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Resumes and returns the data saved in the database.
     * @param {ResumeCreateManyAndReturnArgs} args - Arguments to create many Resumes.
     * @example
     * // Create many Resumes
     * const resume = await prisma.resume.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Resumes and only return the `id`
     * const resumeWithIdOnly = await prisma.resume.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ResumeCreateManyAndReturnArgs>(args?: SelectSubset<T, ResumeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Resume.
     * @param {ResumeDeleteArgs} args - Arguments to delete one Resume.
     * @example
     * // Delete one Resume
     * const Resume = await prisma.resume.delete({
     *   where: {
     *     // ... filter to delete one Resume
     *   }
     * })
     * 
     */
    delete<T extends ResumeDeleteArgs>(args: SelectSubset<T, ResumeDeleteArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Resume.
     * @param {ResumeUpdateArgs} args - Arguments to update one Resume.
     * @example
     * // Update one Resume
     * const resume = await prisma.resume.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ResumeUpdateArgs>(args: SelectSubset<T, ResumeUpdateArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Resumes.
     * @param {ResumeDeleteManyArgs} args - Arguments to filter Resumes to delete.
     * @example
     * // Delete a few Resumes
     * const { count } = await prisma.resume.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ResumeDeleteManyArgs>(args?: SelectSubset<T, ResumeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Resumes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Resumes
     * const resume = await prisma.resume.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ResumeUpdateManyArgs>(args: SelectSubset<T, ResumeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Resume.
     * @param {ResumeUpsertArgs} args - Arguments to update or create a Resume.
     * @example
     * // Update or create a Resume
     * const resume = await prisma.resume.upsert({
     *   create: {
     *     // ... data to create a Resume
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Resume we want to update
     *   }
     * })
     */
    upsert<T extends ResumeUpsertArgs>(args: SelectSubset<T, ResumeUpsertArgs<ExtArgs>>): Prisma__ResumeClient<$Result.GetResult<Prisma.$ResumePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Resumes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeCountArgs} args - Arguments to filter Resumes to count.
     * @example
     * // Count the number of Resumes
     * const count = await prisma.resume.count({
     *   where: {
     *     // ... the filter for the Resumes we want to count
     *   }
     * })
    **/
    count<T extends ResumeCountArgs>(
      args?: Subset<T, ResumeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ResumeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Resume.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ResumeAggregateArgs>(args: Subset<T, ResumeAggregateArgs>): Prisma.PrismaPromise<GetResumeAggregateType<T>>

    /**
     * Group by Resume.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeGroupByArgs} args - Group by arguments.
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
      T extends ResumeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ResumeGroupByArgs['orderBy'] }
        : { orderBy?: ResumeGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ResumeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetResumeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Resume model
   */
  readonly fields: ResumeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Resume.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ResumeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Resume model
   */ 
  interface ResumeFieldRefs {
    readonly id: FieldRef<"Resume", 'String'>
    readonly userId: FieldRef<"Resume", 'String'>
    readonly content: FieldRef<"Resume", 'String'>
    readonly title: FieldRef<"Resume", 'String'>
    readonly filename: FieldRef<"Resume", 'String'>
    readonly filetype: FieldRef<"Resume", 'String'>
    readonly filesize: FieldRef<"Resume", 'Int'>
    readonly parsedData: FieldRef<"Resume", 'Json'>
    readonly vectorId: FieldRef<"Resume", 'String'>
    readonly status: FieldRef<"Resume", 'String'>
    readonly createdAt: FieldRef<"Resume", 'DateTime'>
    readonly updatedAt: FieldRef<"Resume", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Resume findUnique
   */
  export type ResumeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Filter, which Resume to fetch.
     */
    where: ResumeWhereUniqueInput
  }

  /**
   * Resume findUniqueOrThrow
   */
  export type ResumeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Filter, which Resume to fetch.
     */
    where: ResumeWhereUniqueInput
  }

  /**
   * Resume findFirst
   */
  export type ResumeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Filter, which Resume to fetch.
     */
    where?: ResumeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resumes to fetch.
     */
    orderBy?: ResumeOrderByWithRelationInput | ResumeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Resumes.
     */
    cursor?: ResumeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resumes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resumes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Resumes.
     */
    distinct?: ResumeScalarFieldEnum | ResumeScalarFieldEnum[]
  }

  /**
   * Resume findFirstOrThrow
   */
  export type ResumeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Filter, which Resume to fetch.
     */
    where?: ResumeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resumes to fetch.
     */
    orderBy?: ResumeOrderByWithRelationInput | ResumeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Resumes.
     */
    cursor?: ResumeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resumes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resumes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Resumes.
     */
    distinct?: ResumeScalarFieldEnum | ResumeScalarFieldEnum[]
  }

  /**
   * Resume findMany
   */
  export type ResumeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Filter, which Resumes to fetch.
     */
    where?: ResumeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Resumes to fetch.
     */
    orderBy?: ResumeOrderByWithRelationInput | ResumeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Resumes.
     */
    cursor?: ResumeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Resumes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Resumes.
     */
    skip?: number
    distinct?: ResumeScalarFieldEnum | ResumeScalarFieldEnum[]
  }

  /**
   * Resume create
   */
  export type ResumeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * The data needed to create a Resume.
     */
    data: XOR<ResumeCreateInput, ResumeUncheckedCreateInput>
  }

  /**
   * Resume createMany
   */
  export type ResumeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Resumes.
     */
    data: ResumeCreateManyInput | ResumeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Resume createManyAndReturn
   */
  export type ResumeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Resumes.
     */
    data: ResumeCreateManyInput | ResumeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Resume update
   */
  export type ResumeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * The data needed to update a Resume.
     */
    data: XOR<ResumeUpdateInput, ResumeUncheckedUpdateInput>
    /**
     * Choose, which Resume to update.
     */
    where: ResumeWhereUniqueInput
  }

  /**
   * Resume updateMany
   */
  export type ResumeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Resumes.
     */
    data: XOR<ResumeUpdateManyMutationInput, ResumeUncheckedUpdateManyInput>
    /**
     * Filter which Resumes to update
     */
    where?: ResumeWhereInput
  }

  /**
   * Resume upsert
   */
  export type ResumeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * The filter to search for the Resume to update in case it exists.
     */
    where: ResumeWhereUniqueInput
    /**
     * In case the Resume found by the `where` argument doesn't exist, create a new Resume with this data.
     */
    create: XOR<ResumeCreateInput, ResumeUncheckedCreateInput>
    /**
     * In case the Resume was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ResumeUpdateInput, ResumeUncheckedUpdateInput>
  }

  /**
   * Resume delete
   */
  export type ResumeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
    /**
     * Filter which Resume to delete.
     */
    where: ResumeWhereUniqueInput
  }

  /**
   * Resume deleteMany
   */
  export type ResumeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Resumes to delete
     */
    where?: ResumeWhereInput
  }

  /**
   * Resume without action
   */
  export type ResumeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Resume
     */
    select?: ResumeSelect<ExtArgs> | null
  }


  /**
   * Model ResumeAnalysis
   */

  export type AggregateResumeAnalysis = {
    _count: ResumeAnalysisCountAggregateOutputType | null
    _avg: ResumeAnalysisAvgAggregateOutputType | null
    _sum: ResumeAnalysisSumAggregateOutputType | null
    _min: ResumeAnalysisMinAggregateOutputType | null
    _max: ResumeAnalysisMaxAggregateOutputType | null
  }

  export type ResumeAnalysisAvgAggregateOutputType = {
    totalScore: number | null
    skillScore: number | null
    experienceScore: number | null
  }

  export type ResumeAnalysisSumAggregateOutputType = {
    totalScore: number | null
    skillScore: number | null
    experienceScore: number | null
  }

  export type ResumeAnalysisMinAggregateOutputType = {
    id: string | null
    jobId: string | null
    resumeContent: string | null
    totalScore: number | null
    skillScore: number | null
    experienceScore: number | null
    recommended: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ResumeAnalysisMaxAggregateOutputType = {
    id: string | null
    jobId: string | null
    resumeContent: string | null
    totalScore: number | null
    skillScore: number | null
    experienceScore: number | null
    recommended: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ResumeAnalysisCountAggregateOutputType = {
    id: number
    jobId: number
    resumeContent: number
    parsedResume: number
    totalScore: number
    skillScore: number
    experienceScore: number
    matchingPoints: number
    suggestions: number
    recommended: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ResumeAnalysisAvgAggregateInputType = {
    totalScore?: true
    skillScore?: true
    experienceScore?: true
  }

  export type ResumeAnalysisSumAggregateInputType = {
    totalScore?: true
    skillScore?: true
    experienceScore?: true
  }

  export type ResumeAnalysisMinAggregateInputType = {
    id?: true
    jobId?: true
    resumeContent?: true
    totalScore?: true
    skillScore?: true
    experienceScore?: true
    recommended?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ResumeAnalysisMaxAggregateInputType = {
    id?: true
    jobId?: true
    resumeContent?: true
    totalScore?: true
    skillScore?: true
    experienceScore?: true
    recommended?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ResumeAnalysisCountAggregateInputType = {
    id?: true
    jobId?: true
    resumeContent?: true
    parsedResume?: true
    totalScore?: true
    skillScore?: true
    experienceScore?: true
    matchingPoints?: true
    suggestions?: true
    recommended?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ResumeAnalysisAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ResumeAnalysis to aggregate.
     */
    where?: ResumeAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResumeAnalyses to fetch.
     */
    orderBy?: ResumeAnalysisOrderByWithRelationInput | ResumeAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ResumeAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResumeAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResumeAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ResumeAnalyses
    **/
    _count?: true | ResumeAnalysisCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ResumeAnalysisAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ResumeAnalysisSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ResumeAnalysisMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ResumeAnalysisMaxAggregateInputType
  }

  export type GetResumeAnalysisAggregateType<T extends ResumeAnalysisAggregateArgs> = {
        [P in keyof T & keyof AggregateResumeAnalysis]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateResumeAnalysis[P]>
      : GetScalarType<T[P], AggregateResumeAnalysis[P]>
  }




  export type ResumeAnalysisGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResumeAnalysisWhereInput
    orderBy?: ResumeAnalysisOrderByWithAggregationInput | ResumeAnalysisOrderByWithAggregationInput[]
    by: ResumeAnalysisScalarFieldEnum[] | ResumeAnalysisScalarFieldEnum
    having?: ResumeAnalysisScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ResumeAnalysisCountAggregateInputType | true
    _avg?: ResumeAnalysisAvgAggregateInputType
    _sum?: ResumeAnalysisSumAggregateInputType
    _min?: ResumeAnalysisMinAggregateInputType
    _max?: ResumeAnalysisMaxAggregateInputType
  }

  export type ResumeAnalysisGroupByOutputType = {
    id: string
    jobId: string
    resumeContent: string
    parsedResume: JsonValue
    totalScore: number
    skillScore: number
    experienceScore: number
    matchingPoints: JsonValue
    suggestions: JsonValue
    recommended: boolean
    createdAt: Date
    updatedAt: Date
    _count: ResumeAnalysisCountAggregateOutputType | null
    _avg: ResumeAnalysisAvgAggregateOutputType | null
    _sum: ResumeAnalysisSumAggregateOutputType | null
    _min: ResumeAnalysisMinAggregateOutputType | null
    _max: ResumeAnalysisMaxAggregateOutputType | null
  }

  type GetResumeAnalysisGroupByPayload<T extends ResumeAnalysisGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ResumeAnalysisGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ResumeAnalysisGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ResumeAnalysisGroupByOutputType[P]>
            : GetScalarType<T[P], ResumeAnalysisGroupByOutputType[P]>
        }
      >
    >


  export type ResumeAnalysisSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobId?: boolean
    resumeContent?: boolean
    parsedResume?: boolean
    totalScore?: boolean
    skillScore?: boolean
    experienceScore?: boolean
    matchingPoints?: boolean
    suggestions?: boolean
    recommended?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    job?: boolean | JobDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resumeAnalysis"]>

  export type ResumeAnalysisSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobId?: boolean
    resumeContent?: boolean
    parsedResume?: boolean
    totalScore?: boolean
    skillScore?: boolean
    experienceScore?: boolean
    matchingPoints?: boolean
    suggestions?: boolean
    recommended?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    job?: boolean | JobDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["resumeAnalysis"]>

  export type ResumeAnalysisSelectScalar = {
    id?: boolean
    jobId?: boolean
    resumeContent?: boolean
    parsedResume?: boolean
    totalScore?: boolean
    skillScore?: boolean
    experienceScore?: boolean
    matchingPoints?: boolean
    suggestions?: boolean
    recommended?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ResumeAnalysisInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | JobDefaultArgs<ExtArgs>
  }
  export type ResumeAnalysisIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | JobDefaultArgs<ExtArgs>
  }

  export type $ResumeAnalysisPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ResumeAnalysis"
    objects: {
      job: Prisma.$JobPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      jobId: string
      resumeContent: string
      parsedResume: Prisma.JsonValue
      totalScore: number
      skillScore: number
      experienceScore: number
      matchingPoints: Prisma.JsonValue
      suggestions: Prisma.JsonValue
      recommended: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["resumeAnalysis"]>
    composites: {}
  }

  type ResumeAnalysisGetPayload<S extends boolean | null | undefined | ResumeAnalysisDefaultArgs> = $Result.GetResult<Prisma.$ResumeAnalysisPayload, S>

  type ResumeAnalysisCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ResumeAnalysisFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ResumeAnalysisCountAggregateInputType | true
    }

  export interface ResumeAnalysisDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ResumeAnalysis'], meta: { name: 'ResumeAnalysis' } }
    /**
     * Find zero or one ResumeAnalysis that matches the filter.
     * @param {ResumeAnalysisFindUniqueArgs} args - Arguments to find a ResumeAnalysis
     * @example
     * // Get one ResumeAnalysis
     * const resumeAnalysis = await prisma.resumeAnalysis.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ResumeAnalysisFindUniqueArgs>(args: SelectSubset<T, ResumeAnalysisFindUniqueArgs<ExtArgs>>): Prisma__ResumeAnalysisClient<$Result.GetResult<Prisma.$ResumeAnalysisPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ResumeAnalysis that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ResumeAnalysisFindUniqueOrThrowArgs} args - Arguments to find a ResumeAnalysis
     * @example
     * // Get one ResumeAnalysis
     * const resumeAnalysis = await prisma.resumeAnalysis.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ResumeAnalysisFindUniqueOrThrowArgs>(args: SelectSubset<T, ResumeAnalysisFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ResumeAnalysisClient<$Result.GetResult<Prisma.$ResumeAnalysisPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ResumeAnalysis that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeAnalysisFindFirstArgs} args - Arguments to find a ResumeAnalysis
     * @example
     * // Get one ResumeAnalysis
     * const resumeAnalysis = await prisma.resumeAnalysis.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ResumeAnalysisFindFirstArgs>(args?: SelectSubset<T, ResumeAnalysisFindFirstArgs<ExtArgs>>): Prisma__ResumeAnalysisClient<$Result.GetResult<Prisma.$ResumeAnalysisPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ResumeAnalysis that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeAnalysisFindFirstOrThrowArgs} args - Arguments to find a ResumeAnalysis
     * @example
     * // Get one ResumeAnalysis
     * const resumeAnalysis = await prisma.resumeAnalysis.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ResumeAnalysisFindFirstOrThrowArgs>(args?: SelectSubset<T, ResumeAnalysisFindFirstOrThrowArgs<ExtArgs>>): Prisma__ResumeAnalysisClient<$Result.GetResult<Prisma.$ResumeAnalysisPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ResumeAnalyses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeAnalysisFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ResumeAnalyses
     * const resumeAnalyses = await prisma.resumeAnalysis.findMany()
     * 
     * // Get first 10 ResumeAnalyses
     * const resumeAnalyses = await prisma.resumeAnalysis.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const resumeAnalysisWithIdOnly = await prisma.resumeAnalysis.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ResumeAnalysisFindManyArgs>(args?: SelectSubset<T, ResumeAnalysisFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumeAnalysisPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ResumeAnalysis.
     * @param {ResumeAnalysisCreateArgs} args - Arguments to create a ResumeAnalysis.
     * @example
     * // Create one ResumeAnalysis
     * const ResumeAnalysis = await prisma.resumeAnalysis.create({
     *   data: {
     *     // ... data to create a ResumeAnalysis
     *   }
     * })
     * 
     */
    create<T extends ResumeAnalysisCreateArgs>(args: SelectSubset<T, ResumeAnalysisCreateArgs<ExtArgs>>): Prisma__ResumeAnalysisClient<$Result.GetResult<Prisma.$ResumeAnalysisPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ResumeAnalyses.
     * @param {ResumeAnalysisCreateManyArgs} args - Arguments to create many ResumeAnalyses.
     * @example
     * // Create many ResumeAnalyses
     * const resumeAnalysis = await prisma.resumeAnalysis.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ResumeAnalysisCreateManyArgs>(args?: SelectSubset<T, ResumeAnalysisCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ResumeAnalyses and returns the data saved in the database.
     * @param {ResumeAnalysisCreateManyAndReturnArgs} args - Arguments to create many ResumeAnalyses.
     * @example
     * // Create many ResumeAnalyses
     * const resumeAnalysis = await prisma.resumeAnalysis.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ResumeAnalyses and only return the `id`
     * const resumeAnalysisWithIdOnly = await prisma.resumeAnalysis.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ResumeAnalysisCreateManyAndReturnArgs>(args?: SelectSubset<T, ResumeAnalysisCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResumeAnalysisPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ResumeAnalysis.
     * @param {ResumeAnalysisDeleteArgs} args - Arguments to delete one ResumeAnalysis.
     * @example
     * // Delete one ResumeAnalysis
     * const ResumeAnalysis = await prisma.resumeAnalysis.delete({
     *   where: {
     *     // ... filter to delete one ResumeAnalysis
     *   }
     * })
     * 
     */
    delete<T extends ResumeAnalysisDeleteArgs>(args: SelectSubset<T, ResumeAnalysisDeleteArgs<ExtArgs>>): Prisma__ResumeAnalysisClient<$Result.GetResult<Prisma.$ResumeAnalysisPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ResumeAnalysis.
     * @param {ResumeAnalysisUpdateArgs} args - Arguments to update one ResumeAnalysis.
     * @example
     * // Update one ResumeAnalysis
     * const resumeAnalysis = await prisma.resumeAnalysis.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ResumeAnalysisUpdateArgs>(args: SelectSubset<T, ResumeAnalysisUpdateArgs<ExtArgs>>): Prisma__ResumeAnalysisClient<$Result.GetResult<Prisma.$ResumeAnalysisPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ResumeAnalyses.
     * @param {ResumeAnalysisDeleteManyArgs} args - Arguments to filter ResumeAnalyses to delete.
     * @example
     * // Delete a few ResumeAnalyses
     * const { count } = await prisma.resumeAnalysis.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ResumeAnalysisDeleteManyArgs>(args?: SelectSubset<T, ResumeAnalysisDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ResumeAnalyses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeAnalysisUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ResumeAnalyses
     * const resumeAnalysis = await prisma.resumeAnalysis.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ResumeAnalysisUpdateManyArgs>(args: SelectSubset<T, ResumeAnalysisUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ResumeAnalysis.
     * @param {ResumeAnalysisUpsertArgs} args - Arguments to update or create a ResumeAnalysis.
     * @example
     * // Update or create a ResumeAnalysis
     * const resumeAnalysis = await prisma.resumeAnalysis.upsert({
     *   create: {
     *     // ... data to create a ResumeAnalysis
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ResumeAnalysis we want to update
     *   }
     * })
     */
    upsert<T extends ResumeAnalysisUpsertArgs>(args: SelectSubset<T, ResumeAnalysisUpsertArgs<ExtArgs>>): Prisma__ResumeAnalysisClient<$Result.GetResult<Prisma.$ResumeAnalysisPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ResumeAnalyses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeAnalysisCountArgs} args - Arguments to filter ResumeAnalyses to count.
     * @example
     * // Count the number of ResumeAnalyses
     * const count = await prisma.resumeAnalysis.count({
     *   where: {
     *     // ... the filter for the ResumeAnalyses we want to count
     *   }
     * })
    **/
    count<T extends ResumeAnalysisCountArgs>(
      args?: Subset<T, ResumeAnalysisCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ResumeAnalysisCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ResumeAnalysis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeAnalysisAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ResumeAnalysisAggregateArgs>(args: Subset<T, ResumeAnalysisAggregateArgs>): Prisma.PrismaPromise<GetResumeAnalysisAggregateType<T>>

    /**
     * Group by ResumeAnalysis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResumeAnalysisGroupByArgs} args - Group by arguments.
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
      T extends ResumeAnalysisGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ResumeAnalysisGroupByArgs['orderBy'] }
        : { orderBy?: ResumeAnalysisGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ResumeAnalysisGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetResumeAnalysisGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ResumeAnalysis model
   */
  readonly fields: ResumeAnalysisFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ResumeAnalysis.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ResumeAnalysisClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    job<T extends JobDefaultArgs<ExtArgs> = {}>(args?: Subset<T, JobDefaultArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the ResumeAnalysis model
   */ 
  interface ResumeAnalysisFieldRefs {
    readonly id: FieldRef<"ResumeAnalysis", 'String'>
    readonly jobId: FieldRef<"ResumeAnalysis", 'String'>
    readonly resumeContent: FieldRef<"ResumeAnalysis", 'String'>
    readonly parsedResume: FieldRef<"ResumeAnalysis", 'Json'>
    readonly totalScore: FieldRef<"ResumeAnalysis", 'Float'>
    readonly skillScore: FieldRef<"ResumeAnalysis", 'Float'>
    readonly experienceScore: FieldRef<"ResumeAnalysis", 'Float'>
    readonly matchingPoints: FieldRef<"ResumeAnalysis", 'Json'>
    readonly suggestions: FieldRef<"ResumeAnalysis", 'Json'>
    readonly recommended: FieldRef<"ResumeAnalysis", 'Boolean'>
    readonly createdAt: FieldRef<"ResumeAnalysis", 'DateTime'>
    readonly updatedAt: FieldRef<"ResumeAnalysis", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ResumeAnalysis findUnique
   */
  export type ResumeAnalysisFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeAnalysis
     */
    select?: ResumeAnalysisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which ResumeAnalysis to fetch.
     */
    where: ResumeAnalysisWhereUniqueInput
  }

  /**
   * ResumeAnalysis findUniqueOrThrow
   */
  export type ResumeAnalysisFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeAnalysis
     */
    select?: ResumeAnalysisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which ResumeAnalysis to fetch.
     */
    where: ResumeAnalysisWhereUniqueInput
  }

  /**
   * ResumeAnalysis findFirst
   */
  export type ResumeAnalysisFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeAnalysis
     */
    select?: ResumeAnalysisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which ResumeAnalysis to fetch.
     */
    where?: ResumeAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResumeAnalyses to fetch.
     */
    orderBy?: ResumeAnalysisOrderByWithRelationInput | ResumeAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ResumeAnalyses.
     */
    cursor?: ResumeAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResumeAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResumeAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ResumeAnalyses.
     */
    distinct?: ResumeAnalysisScalarFieldEnum | ResumeAnalysisScalarFieldEnum[]
  }

  /**
   * ResumeAnalysis findFirstOrThrow
   */
  export type ResumeAnalysisFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeAnalysis
     */
    select?: ResumeAnalysisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which ResumeAnalysis to fetch.
     */
    where?: ResumeAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResumeAnalyses to fetch.
     */
    orderBy?: ResumeAnalysisOrderByWithRelationInput | ResumeAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ResumeAnalyses.
     */
    cursor?: ResumeAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResumeAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResumeAnalyses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ResumeAnalyses.
     */
    distinct?: ResumeAnalysisScalarFieldEnum | ResumeAnalysisScalarFieldEnum[]
  }

  /**
   * ResumeAnalysis findMany
   */
  export type ResumeAnalysisFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeAnalysis
     */
    select?: ResumeAnalysisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeAnalysisInclude<ExtArgs> | null
    /**
     * Filter, which ResumeAnalyses to fetch.
     */
    where?: ResumeAnalysisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResumeAnalyses to fetch.
     */
    orderBy?: ResumeAnalysisOrderByWithRelationInput | ResumeAnalysisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ResumeAnalyses.
     */
    cursor?: ResumeAnalysisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResumeAnalyses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResumeAnalyses.
     */
    skip?: number
    distinct?: ResumeAnalysisScalarFieldEnum | ResumeAnalysisScalarFieldEnum[]
  }

  /**
   * ResumeAnalysis create
   */
  export type ResumeAnalysisCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeAnalysis
     */
    select?: ResumeAnalysisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeAnalysisInclude<ExtArgs> | null
    /**
     * The data needed to create a ResumeAnalysis.
     */
    data: XOR<ResumeAnalysisCreateInput, ResumeAnalysisUncheckedCreateInput>
  }

  /**
   * ResumeAnalysis createMany
   */
  export type ResumeAnalysisCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ResumeAnalyses.
     */
    data: ResumeAnalysisCreateManyInput | ResumeAnalysisCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ResumeAnalysis createManyAndReturn
   */
  export type ResumeAnalysisCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeAnalysis
     */
    select?: ResumeAnalysisSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ResumeAnalyses.
     */
    data: ResumeAnalysisCreateManyInput | ResumeAnalysisCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeAnalysisIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ResumeAnalysis update
   */
  export type ResumeAnalysisUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeAnalysis
     */
    select?: ResumeAnalysisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeAnalysisInclude<ExtArgs> | null
    /**
     * The data needed to update a ResumeAnalysis.
     */
    data: XOR<ResumeAnalysisUpdateInput, ResumeAnalysisUncheckedUpdateInput>
    /**
     * Choose, which ResumeAnalysis to update.
     */
    where: ResumeAnalysisWhereUniqueInput
  }

  /**
   * ResumeAnalysis updateMany
   */
  export type ResumeAnalysisUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ResumeAnalyses.
     */
    data: XOR<ResumeAnalysisUpdateManyMutationInput, ResumeAnalysisUncheckedUpdateManyInput>
    /**
     * Filter which ResumeAnalyses to update
     */
    where?: ResumeAnalysisWhereInput
  }

  /**
   * ResumeAnalysis upsert
   */
  export type ResumeAnalysisUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeAnalysis
     */
    select?: ResumeAnalysisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeAnalysisInclude<ExtArgs> | null
    /**
     * The filter to search for the ResumeAnalysis to update in case it exists.
     */
    where: ResumeAnalysisWhereUniqueInput
    /**
     * In case the ResumeAnalysis found by the `where` argument doesn't exist, create a new ResumeAnalysis with this data.
     */
    create: XOR<ResumeAnalysisCreateInput, ResumeAnalysisUncheckedCreateInput>
    /**
     * In case the ResumeAnalysis was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ResumeAnalysisUpdateInput, ResumeAnalysisUncheckedUpdateInput>
  }

  /**
   * ResumeAnalysis delete
   */
  export type ResumeAnalysisDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeAnalysis
     */
    select?: ResumeAnalysisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeAnalysisInclude<ExtArgs> | null
    /**
     * Filter which ResumeAnalysis to delete.
     */
    where: ResumeAnalysisWhereUniqueInput
  }

  /**
   * ResumeAnalysis deleteMany
   */
  export type ResumeAnalysisDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ResumeAnalyses to delete
     */
    where?: ResumeAnalysisWhereInput
  }

  /**
   * ResumeAnalysis without action
   */
  export type ResumeAnalysisDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResumeAnalysis
     */
    select?: ResumeAnalysisSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResumeAnalysisInclude<ExtArgs> | null
  }


  /**
   * Model Application
   */

  export type AggregateApplication = {
    _count: ApplicationCountAggregateOutputType | null
    _min: ApplicationMinAggregateOutputType | null
    _max: ApplicationMaxAggregateOutputType | null
  }

  export type ApplicationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    jobId: string | null
    status: string | null
    createdAt: Date | null
  }

  export type ApplicationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    jobId: string | null
    status: string | null
    createdAt: Date | null
  }

  export type ApplicationCountAggregateOutputType = {
    id: number
    userId: number
    jobId: number
    status: number
    createdAt: number
    _all: number
  }


  export type ApplicationMinAggregateInputType = {
    id?: true
    userId?: true
    jobId?: true
    status?: true
    createdAt?: true
  }

  export type ApplicationMaxAggregateInputType = {
    id?: true
    userId?: true
    jobId?: true
    status?: true
    createdAt?: true
  }

  export type ApplicationCountAggregateInputType = {
    id?: true
    userId?: true
    jobId?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type ApplicationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Application to aggregate.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Applications
    **/
    _count?: true | ApplicationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ApplicationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ApplicationMaxAggregateInputType
  }

  export type GetApplicationAggregateType<T extends ApplicationAggregateArgs> = {
        [P in keyof T & keyof AggregateApplication]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApplication[P]>
      : GetScalarType<T[P], AggregateApplication[P]>
  }




  export type ApplicationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApplicationWhereInput
    orderBy?: ApplicationOrderByWithAggregationInput | ApplicationOrderByWithAggregationInput[]
    by: ApplicationScalarFieldEnum[] | ApplicationScalarFieldEnum
    having?: ApplicationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ApplicationCountAggregateInputType | true
    _min?: ApplicationMinAggregateInputType
    _max?: ApplicationMaxAggregateInputType
  }

  export type ApplicationGroupByOutputType = {
    id: string
    userId: string
    jobId: string
    status: string
    createdAt: Date
    _count: ApplicationCountAggregateOutputType | null
    _min: ApplicationMinAggregateOutputType | null
    _max: ApplicationMaxAggregateOutputType | null
  }

  type GetApplicationGroupByPayload<T extends ApplicationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ApplicationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ApplicationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ApplicationGroupByOutputType[P]>
            : GetScalarType<T[P], ApplicationGroupByOutputType[P]>
        }
      >
    >


  export type ApplicationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    jobId?: boolean
    status?: boolean
    createdAt?: boolean
    job?: boolean | JobDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["application"]>

  export type ApplicationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    jobId?: boolean
    status?: boolean
    createdAt?: boolean
    job?: boolean | JobDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["application"]>

  export type ApplicationSelectScalar = {
    id?: boolean
    userId?: boolean
    jobId?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type ApplicationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | JobDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ApplicationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | JobDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ApplicationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Application"
    objects: {
      job: Prisma.$JobPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      jobId: string
      status: string
      createdAt: Date
    }, ExtArgs["result"]["application"]>
    composites: {}
  }

  type ApplicationGetPayload<S extends boolean | null | undefined | ApplicationDefaultArgs> = $Result.GetResult<Prisma.$ApplicationPayload, S>

  type ApplicationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ApplicationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ApplicationCountAggregateInputType | true
    }

  export interface ApplicationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Application'], meta: { name: 'Application' } }
    /**
     * Find zero or one Application that matches the filter.
     * @param {ApplicationFindUniqueArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ApplicationFindUniqueArgs>(args: SelectSubset<T, ApplicationFindUniqueArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Application that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ApplicationFindUniqueOrThrowArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ApplicationFindUniqueOrThrowArgs>(args: SelectSubset<T, ApplicationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Application that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationFindFirstArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ApplicationFindFirstArgs>(args?: SelectSubset<T, ApplicationFindFirstArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Application that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationFindFirstOrThrowArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ApplicationFindFirstOrThrowArgs>(args?: SelectSubset<T, ApplicationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Applications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Applications
     * const applications = await prisma.application.findMany()
     * 
     * // Get first 10 Applications
     * const applications = await prisma.application.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const applicationWithIdOnly = await prisma.application.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ApplicationFindManyArgs>(args?: SelectSubset<T, ApplicationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Application.
     * @param {ApplicationCreateArgs} args - Arguments to create a Application.
     * @example
     * // Create one Application
     * const Application = await prisma.application.create({
     *   data: {
     *     // ... data to create a Application
     *   }
     * })
     * 
     */
    create<T extends ApplicationCreateArgs>(args: SelectSubset<T, ApplicationCreateArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Applications.
     * @param {ApplicationCreateManyArgs} args - Arguments to create many Applications.
     * @example
     * // Create many Applications
     * const application = await prisma.application.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ApplicationCreateManyArgs>(args?: SelectSubset<T, ApplicationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Applications and returns the data saved in the database.
     * @param {ApplicationCreateManyAndReturnArgs} args - Arguments to create many Applications.
     * @example
     * // Create many Applications
     * const application = await prisma.application.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Applications and only return the `id`
     * const applicationWithIdOnly = await prisma.application.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ApplicationCreateManyAndReturnArgs>(args?: SelectSubset<T, ApplicationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Application.
     * @param {ApplicationDeleteArgs} args - Arguments to delete one Application.
     * @example
     * // Delete one Application
     * const Application = await prisma.application.delete({
     *   where: {
     *     // ... filter to delete one Application
     *   }
     * })
     * 
     */
    delete<T extends ApplicationDeleteArgs>(args: SelectSubset<T, ApplicationDeleteArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Application.
     * @param {ApplicationUpdateArgs} args - Arguments to update one Application.
     * @example
     * // Update one Application
     * const application = await prisma.application.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ApplicationUpdateArgs>(args: SelectSubset<T, ApplicationUpdateArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Applications.
     * @param {ApplicationDeleteManyArgs} args - Arguments to filter Applications to delete.
     * @example
     * // Delete a few Applications
     * const { count } = await prisma.application.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ApplicationDeleteManyArgs>(args?: SelectSubset<T, ApplicationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Applications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Applications
     * const application = await prisma.application.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ApplicationUpdateManyArgs>(args: SelectSubset<T, ApplicationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Application.
     * @param {ApplicationUpsertArgs} args - Arguments to update or create a Application.
     * @example
     * // Update or create a Application
     * const application = await prisma.application.upsert({
     *   create: {
     *     // ... data to create a Application
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Application we want to update
     *   }
     * })
     */
    upsert<T extends ApplicationUpsertArgs>(args: SelectSubset<T, ApplicationUpsertArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Applications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationCountArgs} args - Arguments to filter Applications to count.
     * @example
     * // Count the number of Applications
     * const count = await prisma.application.count({
     *   where: {
     *     // ... the filter for the Applications we want to count
     *   }
     * })
    **/
    count<T extends ApplicationCountArgs>(
      args?: Subset<T, ApplicationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ApplicationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Application.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ApplicationAggregateArgs>(args: Subset<T, ApplicationAggregateArgs>): Prisma.PrismaPromise<GetApplicationAggregateType<T>>

    /**
     * Group by Application.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationGroupByArgs} args - Group by arguments.
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
      T extends ApplicationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ApplicationGroupByArgs['orderBy'] }
        : { orderBy?: ApplicationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ApplicationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApplicationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Application model
   */
  readonly fields: ApplicationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Application.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ApplicationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    job<T extends JobDefaultArgs<ExtArgs> = {}>(args?: Subset<T, JobDefaultArgs<ExtArgs>>): Prisma__JobClient<$Result.GetResult<Prisma.$JobPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the Application model
   */ 
  interface ApplicationFieldRefs {
    readonly id: FieldRef<"Application", 'String'>
    readonly userId: FieldRef<"Application", 'String'>
    readonly jobId: FieldRef<"Application", 'String'>
    readonly status: FieldRef<"Application", 'String'>
    readonly createdAt: FieldRef<"Application", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Application findUnique
   */
  export type ApplicationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application findUniqueOrThrow
   */
  export type ApplicationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application findFirst
   */
  export type ApplicationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Applications.
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Applications.
     */
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Application findFirstOrThrow
   */
  export type ApplicationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Applications.
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Applications.
     */
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Application findMany
   */
  export type ApplicationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Applications to fetch.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Applications.
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Application create
   */
  export type ApplicationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * The data needed to create a Application.
     */
    data: XOR<ApplicationCreateInput, ApplicationUncheckedCreateInput>
  }

  /**
   * Application createMany
   */
  export type ApplicationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Applications.
     */
    data: ApplicationCreateManyInput | ApplicationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Application createManyAndReturn
   */
  export type ApplicationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Applications.
     */
    data: ApplicationCreateManyInput | ApplicationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Application update
   */
  export type ApplicationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * The data needed to update a Application.
     */
    data: XOR<ApplicationUpdateInput, ApplicationUncheckedUpdateInput>
    /**
     * Choose, which Application to update.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application updateMany
   */
  export type ApplicationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Applications.
     */
    data: XOR<ApplicationUpdateManyMutationInput, ApplicationUncheckedUpdateManyInput>
    /**
     * Filter which Applications to update
     */
    where?: ApplicationWhereInput
  }

  /**
   * Application upsert
   */
  export type ApplicationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * The filter to search for the Application to update in case it exists.
     */
    where: ApplicationWhereUniqueInput
    /**
     * In case the Application found by the `where` argument doesn't exist, create a new Application with this data.
     */
    create: XOR<ApplicationCreateInput, ApplicationUncheckedCreateInput>
    /**
     * In case the Application was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ApplicationUpdateInput, ApplicationUncheckedUpdateInput>
  }

  /**
   * Application delete
   */
  export type ApplicationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter which Application to delete.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application deleteMany
   */
  export type ApplicationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Applications to delete
     */
    where?: ApplicationWhereInput
  }

  /**
   * Application without action
   */
  export type ApplicationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
  }


  /**
   * Model NFTProof
   */

  export type AggregateNFTProof = {
    _count: NFTProofCountAggregateOutputType | null
    _min: NFTProofMinAggregateOutputType | null
    _max: NFTProofMaxAggregateOutputType | null
  }

  export type NFTProofMinAggregateOutputType = {
    id: string | null
    userId: string | null
    nftType: string | null
    tokenId: string | null
    txHash: string | null
    mintedAt: Date | null
  }

  export type NFTProofMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    nftType: string | null
    tokenId: string | null
    txHash: string | null
    mintedAt: Date | null
  }

  export type NFTProofCountAggregateOutputType = {
    id: number
    userId: number
    nftType: number
    tokenId: number
    txHash: number
    mintedAt: number
    _all: number
  }


  export type NFTProofMinAggregateInputType = {
    id?: true
    userId?: true
    nftType?: true
    tokenId?: true
    txHash?: true
    mintedAt?: true
  }

  export type NFTProofMaxAggregateInputType = {
    id?: true
    userId?: true
    nftType?: true
    tokenId?: true
    txHash?: true
    mintedAt?: true
  }

  export type NFTProofCountAggregateInputType = {
    id?: true
    userId?: true
    nftType?: true
    tokenId?: true
    txHash?: true
    mintedAt?: true
    _all?: true
  }

  export type NFTProofAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NFTProof to aggregate.
     */
    where?: NFTProofWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NFTProofs to fetch.
     */
    orderBy?: NFTProofOrderByWithRelationInput | NFTProofOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NFTProofWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NFTProofs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NFTProofs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NFTProofs
    **/
    _count?: true | NFTProofCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NFTProofMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NFTProofMaxAggregateInputType
  }

  export type GetNFTProofAggregateType<T extends NFTProofAggregateArgs> = {
        [P in keyof T & keyof AggregateNFTProof]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNFTProof[P]>
      : GetScalarType<T[P], AggregateNFTProof[P]>
  }




  export type NFTProofGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NFTProofWhereInput
    orderBy?: NFTProofOrderByWithAggregationInput | NFTProofOrderByWithAggregationInput[]
    by: NFTProofScalarFieldEnum[] | NFTProofScalarFieldEnum
    having?: NFTProofScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NFTProofCountAggregateInputType | true
    _min?: NFTProofMinAggregateInputType
    _max?: NFTProofMaxAggregateInputType
  }

  export type NFTProofGroupByOutputType = {
    id: string
    userId: string
    nftType: string
    tokenId: string
    txHash: string
    mintedAt: Date
    _count: NFTProofCountAggregateOutputType | null
    _min: NFTProofMinAggregateOutputType | null
    _max: NFTProofMaxAggregateOutputType | null
  }

  type GetNFTProofGroupByPayload<T extends NFTProofGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NFTProofGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NFTProofGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NFTProofGroupByOutputType[P]>
            : GetScalarType<T[P], NFTProofGroupByOutputType[P]>
        }
      >
    >


  export type NFTProofSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    nftType?: boolean
    tokenId?: boolean
    txHash?: boolean
    mintedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["nFTProof"]>

  export type NFTProofSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    nftType?: boolean
    tokenId?: boolean
    txHash?: boolean
    mintedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["nFTProof"]>

  export type NFTProofSelectScalar = {
    id?: boolean
    userId?: boolean
    nftType?: boolean
    tokenId?: boolean
    txHash?: boolean
    mintedAt?: boolean
  }

  export type NFTProofInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type NFTProofIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $NFTProofPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NFTProof"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      nftType: string
      tokenId: string
      txHash: string
      mintedAt: Date
    }, ExtArgs["result"]["nFTProof"]>
    composites: {}
  }

  type NFTProofGetPayload<S extends boolean | null | undefined | NFTProofDefaultArgs> = $Result.GetResult<Prisma.$NFTProofPayload, S>

  type NFTProofCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<NFTProofFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: NFTProofCountAggregateInputType | true
    }

  export interface NFTProofDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NFTProof'], meta: { name: 'NFTProof' } }
    /**
     * Find zero or one NFTProof that matches the filter.
     * @param {NFTProofFindUniqueArgs} args - Arguments to find a NFTProof
     * @example
     * // Get one NFTProof
     * const nFTProof = await prisma.nFTProof.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NFTProofFindUniqueArgs>(args: SelectSubset<T, NFTProofFindUniqueArgs<ExtArgs>>): Prisma__NFTProofClient<$Result.GetResult<Prisma.$NFTProofPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one NFTProof that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {NFTProofFindUniqueOrThrowArgs} args - Arguments to find a NFTProof
     * @example
     * // Get one NFTProof
     * const nFTProof = await prisma.nFTProof.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NFTProofFindUniqueOrThrowArgs>(args: SelectSubset<T, NFTProofFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NFTProofClient<$Result.GetResult<Prisma.$NFTProofPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first NFTProof that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NFTProofFindFirstArgs} args - Arguments to find a NFTProof
     * @example
     * // Get one NFTProof
     * const nFTProof = await prisma.nFTProof.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NFTProofFindFirstArgs>(args?: SelectSubset<T, NFTProofFindFirstArgs<ExtArgs>>): Prisma__NFTProofClient<$Result.GetResult<Prisma.$NFTProofPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first NFTProof that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NFTProofFindFirstOrThrowArgs} args - Arguments to find a NFTProof
     * @example
     * // Get one NFTProof
     * const nFTProof = await prisma.nFTProof.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NFTProofFindFirstOrThrowArgs>(args?: SelectSubset<T, NFTProofFindFirstOrThrowArgs<ExtArgs>>): Prisma__NFTProofClient<$Result.GetResult<Prisma.$NFTProofPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more NFTProofs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NFTProofFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NFTProofs
     * const nFTProofs = await prisma.nFTProof.findMany()
     * 
     * // Get first 10 NFTProofs
     * const nFTProofs = await prisma.nFTProof.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const nFTProofWithIdOnly = await prisma.nFTProof.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NFTProofFindManyArgs>(args?: SelectSubset<T, NFTProofFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NFTProofPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a NFTProof.
     * @param {NFTProofCreateArgs} args - Arguments to create a NFTProof.
     * @example
     * // Create one NFTProof
     * const NFTProof = await prisma.nFTProof.create({
     *   data: {
     *     // ... data to create a NFTProof
     *   }
     * })
     * 
     */
    create<T extends NFTProofCreateArgs>(args: SelectSubset<T, NFTProofCreateArgs<ExtArgs>>): Prisma__NFTProofClient<$Result.GetResult<Prisma.$NFTProofPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many NFTProofs.
     * @param {NFTProofCreateManyArgs} args - Arguments to create many NFTProofs.
     * @example
     * // Create many NFTProofs
     * const nFTProof = await prisma.nFTProof.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NFTProofCreateManyArgs>(args?: SelectSubset<T, NFTProofCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NFTProofs and returns the data saved in the database.
     * @param {NFTProofCreateManyAndReturnArgs} args - Arguments to create many NFTProofs.
     * @example
     * // Create many NFTProofs
     * const nFTProof = await prisma.nFTProof.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NFTProofs and only return the `id`
     * const nFTProofWithIdOnly = await prisma.nFTProof.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NFTProofCreateManyAndReturnArgs>(args?: SelectSubset<T, NFTProofCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NFTProofPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a NFTProof.
     * @param {NFTProofDeleteArgs} args - Arguments to delete one NFTProof.
     * @example
     * // Delete one NFTProof
     * const NFTProof = await prisma.nFTProof.delete({
     *   where: {
     *     // ... filter to delete one NFTProof
     *   }
     * })
     * 
     */
    delete<T extends NFTProofDeleteArgs>(args: SelectSubset<T, NFTProofDeleteArgs<ExtArgs>>): Prisma__NFTProofClient<$Result.GetResult<Prisma.$NFTProofPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one NFTProof.
     * @param {NFTProofUpdateArgs} args - Arguments to update one NFTProof.
     * @example
     * // Update one NFTProof
     * const nFTProof = await prisma.nFTProof.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NFTProofUpdateArgs>(args: SelectSubset<T, NFTProofUpdateArgs<ExtArgs>>): Prisma__NFTProofClient<$Result.GetResult<Prisma.$NFTProofPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more NFTProofs.
     * @param {NFTProofDeleteManyArgs} args - Arguments to filter NFTProofs to delete.
     * @example
     * // Delete a few NFTProofs
     * const { count } = await prisma.nFTProof.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NFTProofDeleteManyArgs>(args?: SelectSubset<T, NFTProofDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NFTProofs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NFTProofUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NFTProofs
     * const nFTProof = await prisma.nFTProof.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NFTProofUpdateManyArgs>(args: SelectSubset<T, NFTProofUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one NFTProof.
     * @param {NFTProofUpsertArgs} args - Arguments to update or create a NFTProof.
     * @example
     * // Update or create a NFTProof
     * const nFTProof = await prisma.nFTProof.upsert({
     *   create: {
     *     // ... data to create a NFTProof
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NFTProof we want to update
     *   }
     * })
     */
    upsert<T extends NFTProofUpsertArgs>(args: SelectSubset<T, NFTProofUpsertArgs<ExtArgs>>): Prisma__NFTProofClient<$Result.GetResult<Prisma.$NFTProofPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of NFTProofs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NFTProofCountArgs} args - Arguments to filter NFTProofs to count.
     * @example
     * // Count the number of NFTProofs
     * const count = await prisma.nFTProof.count({
     *   where: {
     *     // ... the filter for the NFTProofs we want to count
     *   }
     * })
    **/
    count<T extends NFTProofCountArgs>(
      args?: Subset<T, NFTProofCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NFTProofCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NFTProof.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NFTProofAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends NFTProofAggregateArgs>(args: Subset<T, NFTProofAggregateArgs>): Prisma.PrismaPromise<GetNFTProofAggregateType<T>>

    /**
     * Group by NFTProof.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NFTProofGroupByArgs} args - Group by arguments.
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
      T extends NFTProofGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NFTProofGroupByArgs['orderBy'] }
        : { orderBy?: NFTProofGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, NFTProofGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNFTProofGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NFTProof model
   */
  readonly fields: NFTProofFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NFTProof.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NFTProofClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
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
   * Fields of the NFTProof model
   */ 
  interface NFTProofFieldRefs {
    readonly id: FieldRef<"NFTProof", 'String'>
    readonly userId: FieldRef<"NFTProof", 'String'>
    readonly nftType: FieldRef<"NFTProof", 'String'>
    readonly tokenId: FieldRef<"NFTProof", 'String'>
    readonly txHash: FieldRef<"NFTProof", 'String'>
    readonly mintedAt: FieldRef<"NFTProof", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NFTProof findUnique
   */
  export type NFTProofFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NFTProof
     */
    select?: NFTProofSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NFTProofInclude<ExtArgs> | null
    /**
     * Filter, which NFTProof to fetch.
     */
    where: NFTProofWhereUniqueInput
  }

  /**
   * NFTProof findUniqueOrThrow
   */
  export type NFTProofFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NFTProof
     */
    select?: NFTProofSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NFTProofInclude<ExtArgs> | null
    /**
     * Filter, which NFTProof to fetch.
     */
    where: NFTProofWhereUniqueInput
  }

  /**
   * NFTProof findFirst
   */
  export type NFTProofFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NFTProof
     */
    select?: NFTProofSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NFTProofInclude<ExtArgs> | null
    /**
     * Filter, which NFTProof to fetch.
     */
    where?: NFTProofWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NFTProofs to fetch.
     */
    orderBy?: NFTProofOrderByWithRelationInput | NFTProofOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NFTProofs.
     */
    cursor?: NFTProofWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NFTProofs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NFTProofs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NFTProofs.
     */
    distinct?: NFTProofScalarFieldEnum | NFTProofScalarFieldEnum[]
  }

  /**
   * NFTProof findFirstOrThrow
   */
  export type NFTProofFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NFTProof
     */
    select?: NFTProofSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NFTProofInclude<ExtArgs> | null
    /**
     * Filter, which NFTProof to fetch.
     */
    where?: NFTProofWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NFTProofs to fetch.
     */
    orderBy?: NFTProofOrderByWithRelationInput | NFTProofOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NFTProofs.
     */
    cursor?: NFTProofWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NFTProofs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NFTProofs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NFTProofs.
     */
    distinct?: NFTProofScalarFieldEnum | NFTProofScalarFieldEnum[]
  }

  /**
   * NFTProof findMany
   */
  export type NFTProofFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NFTProof
     */
    select?: NFTProofSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NFTProofInclude<ExtArgs> | null
    /**
     * Filter, which NFTProofs to fetch.
     */
    where?: NFTProofWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NFTProofs to fetch.
     */
    orderBy?: NFTProofOrderByWithRelationInput | NFTProofOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NFTProofs.
     */
    cursor?: NFTProofWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NFTProofs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NFTProofs.
     */
    skip?: number
    distinct?: NFTProofScalarFieldEnum | NFTProofScalarFieldEnum[]
  }

  /**
   * NFTProof create
   */
  export type NFTProofCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NFTProof
     */
    select?: NFTProofSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NFTProofInclude<ExtArgs> | null
    /**
     * The data needed to create a NFTProof.
     */
    data: XOR<NFTProofCreateInput, NFTProofUncheckedCreateInput>
  }

  /**
   * NFTProof createMany
   */
  export type NFTProofCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NFTProofs.
     */
    data: NFTProofCreateManyInput | NFTProofCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NFTProof createManyAndReturn
   */
  export type NFTProofCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NFTProof
     */
    select?: NFTProofSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many NFTProofs.
     */
    data: NFTProofCreateManyInput | NFTProofCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NFTProofIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * NFTProof update
   */
  export type NFTProofUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NFTProof
     */
    select?: NFTProofSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NFTProofInclude<ExtArgs> | null
    /**
     * The data needed to update a NFTProof.
     */
    data: XOR<NFTProofUpdateInput, NFTProofUncheckedUpdateInput>
    /**
     * Choose, which NFTProof to update.
     */
    where: NFTProofWhereUniqueInput
  }

  /**
   * NFTProof updateMany
   */
  export type NFTProofUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NFTProofs.
     */
    data: XOR<NFTProofUpdateManyMutationInput, NFTProofUncheckedUpdateManyInput>
    /**
     * Filter which NFTProofs to update
     */
    where?: NFTProofWhereInput
  }

  /**
   * NFTProof upsert
   */
  export type NFTProofUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NFTProof
     */
    select?: NFTProofSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NFTProofInclude<ExtArgs> | null
    /**
     * The filter to search for the NFTProof to update in case it exists.
     */
    where: NFTProofWhereUniqueInput
    /**
     * In case the NFTProof found by the `where` argument doesn't exist, create a new NFTProof with this data.
     */
    create: XOR<NFTProofCreateInput, NFTProofUncheckedCreateInput>
    /**
     * In case the NFTProof was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NFTProofUpdateInput, NFTProofUncheckedUpdateInput>
  }

  /**
   * NFTProof delete
   */
  export type NFTProofDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NFTProof
     */
    select?: NFTProofSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NFTProofInclude<ExtArgs> | null
    /**
     * Filter which NFTProof to delete.
     */
    where: NFTProofWhereUniqueInput
  }

  /**
   * NFTProof deleteMany
   */
  export type NFTProofDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NFTProofs to delete
     */
    where?: NFTProofWhereInput
  }

  /**
   * NFTProof without action
   */
  export type NFTProofDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NFTProof
     */
    select?: NFTProofSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NFTProofInclude<ExtArgs> | null
  }


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
    topic_id: string | null
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
    topic_id: string | null
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
    topic_id: string
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
      topic_id: string
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
    readonly topic_id: FieldRef<"job_posting", 'String'>
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
    tag_id: number | null
  }

  export type Job_tag_relationSumAggregateOutputType = {
    tag_id: bigint | null
  }

  export type Job_tag_relationMinAggregateOutputType = {
    topic_id: string | null
    tag_id: bigint | null
    ffrom: string | null
  }

  export type Job_tag_relationMaxAggregateOutputType = {
    topic_id: string | null
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
    tag_id?: true
  }

  export type Job_tag_relationSumAggregateInputType = {
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
    topic_id: string
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
      topic_id: string
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
    readonly topic_id: FieldRef<"job_tag_relation", 'String'>
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
   * Model job_user_relation
   */

  export type AggregateJob_user_relation = {
    _count: Job_user_relationCountAggregateOutputType | null
    _avg: Job_user_relationAvgAggregateOutputType | null
    _sum: Job_user_relationSumAggregateOutputType | null
    _min: Job_user_relationMinAggregateOutputType | null
    _max: Job_user_relationMaxAggregateOutputType | null
  }

  export type Job_user_relationAvgAggregateOutputType = {
    user_id: number | null
  }

  export type Job_user_relationSumAggregateOutputType = {
    user_id: bigint | null
  }

  export type Job_user_relationMinAggregateOutputType = {
    topic_id: string | null
    user_id: bigint | null
    ffrom: string | null
  }

  export type Job_user_relationMaxAggregateOutputType = {
    topic_id: string | null
    user_id: bigint | null
    ffrom: string | null
  }

  export type Job_user_relationCountAggregateOutputType = {
    topic_id: number
    user_id: number
    ffrom: number
    _all: number
  }


  export type Job_user_relationAvgAggregateInputType = {
    user_id?: true
  }

  export type Job_user_relationSumAggregateInputType = {
    user_id?: true
  }

  export type Job_user_relationMinAggregateInputType = {
    topic_id?: true
    user_id?: true
    ffrom?: true
  }

  export type Job_user_relationMaxAggregateInputType = {
    topic_id?: true
    user_id?: true
    ffrom?: true
  }

  export type Job_user_relationCountAggregateInputType = {
    topic_id?: true
    user_id?: true
    ffrom?: true
    _all?: true
  }

  export type Job_user_relationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which job_user_relation to aggregate.
     */
    where?: job_user_relationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of job_user_relations to fetch.
     */
    orderBy?: job_user_relationOrderByWithRelationInput | job_user_relationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: job_user_relationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` job_user_relations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` job_user_relations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned job_user_relations
    **/
    _count?: true | Job_user_relationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Job_user_relationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Job_user_relationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Job_user_relationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Job_user_relationMaxAggregateInputType
  }

  export type GetJob_user_relationAggregateType<T extends Job_user_relationAggregateArgs> = {
        [P in keyof T & keyof AggregateJob_user_relation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateJob_user_relation[P]>
      : GetScalarType<T[P], AggregateJob_user_relation[P]>
  }




  export type job_user_relationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: job_user_relationWhereInput
    orderBy?: job_user_relationOrderByWithAggregationInput | job_user_relationOrderByWithAggregationInput[]
    by: Job_user_relationScalarFieldEnum[] | Job_user_relationScalarFieldEnum
    having?: job_user_relationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Job_user_relationCountAggregateInputType | true
    _avg?: Job_user_relationAvgAggregateInputType
    _sum?: Job_user_relationSumAggregateInputType
    _min?: Job_user_relationMinAggregateInputType
    _max?: Job_user_relationMaxAggregateInputType
  }

  export type Job_user_relationGroupByOutputType = {
    topic_id: string
    user_id: bigint
    ffrom: string | null
    _count: Job_user_relationCountAggregateOutputType | null
    _avg: Job_user_relationAvgAggregateOutputType | null
    _sum: Job_user_relationSumAggregateOutputType | null
    _min: Job_user_relationMinAggregateOutputType | null
    _max: Job_user_relationMaxAggregateOutputType | null
  }

  type GetJob_user_relationGroupByPayload<T extends job_user_relationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Job_user_relationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Job_user_relationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Job_user_relationGroupByOutputType[P]>
            : GetScalarType<T[P], Job_user_relationGroupByOutputType[P]>
        }
      >
    >


  export type job_user_relationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    topic_id?: boolean
    user_id?: boolean
    ffrom?: boolean
  }, ExtArgs["result"]["job_user_relation"]>

  export type job_user_relationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    topic_id?: boolean
    user_id?: boolean
    ffrom?: boolean
  }, ExtArgs["result"]["job_user_relation"]>

  export type job_user_relationSelectScalar = {
    topic_id?: boolean
    user_id?: boolean
    ffrom?: boolean
  }


  export type $job_user_relationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "job_user_relation"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      topic_id: string
      user_id: bigint
      ffrom: string | null
    }, ExtArgs["result"]["job_user_relation"]>
    composites: {}
  }

  type job_user_relationGetPayload<S extends boolean | null | undefined | job_user_relationDefaultArgs> = $Result.GetResult<Prisma.$job_user_relationPayload, S>

  type job_user_relationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<job_user_relationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: Job_user_relationCountAggregateInputType | true
    }

  export interface job_user_relationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['job_user_relation'], meta: { name: 'job_user_relation' } }
    /**
     * Find zero or one Job_user_relation that matches the filter.
     * @param {job_user_relationFindUniqueArgs} args - Arguments to find a Job_user_relation
     * @example
     * // Get one Job_user_relation
     * const job_user_relation = await prisma.job_user_relation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends job_user_relationFindUniqueArgs>(args: SelectSubset<T, job_user_relationFindUniqueArgs<ExtArgs>>): Prisma__job_user_relationClient<$Result.GetResult<Prisma.$job_user_relationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Job_user_relation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {job_user_relationFindUniqueOrThrowArgs} args - Arguments to find a Job_user_relation
     * @example
     * // Get one Job_user_relation
     * const job_user_relation = await prisma.job_user_relation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends job_user_relationFindUniqueOrThrowArgs>(args: SelectSubset<T, job_user_relationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__job_user_relationClient<$Result.GetResult<Prisma.$job_user_relationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Job_user_relation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {job_user_relationFindFirstArgs} args - Arguments to find a Job_user_relation
     * @example
     * // Get one Job_user_relation
     * const job_user_relation = await prisma.job_user_relation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends job_user_relationFindFirstArgs>(args?: SelectSubset<T, job_user_relationFindFirstArgs<ExtArgs>>): Prisma__job_user_relationClient<$Result.GetResult<Prisma.$job_user_relationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Job_user_relation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {job_user_relationFindFirstOrThrowArgs} args - Arguments to find a Job_user_relation
     * @example
     * // Get one Job_user_relation
     * const job_user_relation = await prisma.job_user_relation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends job_user_relationFindFirstOrThrowArgs>(args?: SelectSubset<T, job_user_relationFindFirstOrThrowArgs<ExtArgs>>): Prisma__job_user_relationClient<$Result.GetResult<Prisma.$job_user_relationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Job_user_relations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {job_user_relationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Job_user_relations
     * const job_user_relations = await prisma.job_user_relation.findMany()
     * 
     * // Get first 10 Job_user_relations
     * const job_user_relations = await prisma.job_user_relation.findMany({ take: 10 })
     * 
     * // Only select the `topic_id`
     * const job_user_relationWithTopic_idOnly = await prisma.job_user_relation.findMany({ select: { topic_id: true } })
     * 
     */
    findMany<T extends job_user_relationFindManyArgs>(args?: SelectSubset<T, job_user_relationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$job_user_relationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Job_user_relation.
     * @param {job_user_relationCreateArgs} args - Arguments to create a Job_user_relation.
     * @example
     * // Create one Job_user_relation
     * const Job_user_relation = await prisma.job_user_relation.create({
     *   data: {
     *     // ... data to create a Job_user_relation
     *   }
     * })
     * 
     */
    create<T extends job_user_relationCreateArgs>(args: SelectSubset<T, job_user_relationCreateArgs<ExtArgs>>): Prisma__job_user_relationClient<$Result.GetResult<Prisma.$job_user_relationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Job_user_relations.
     * @param {job_user_relationCreateManyArgs} args - Arguments to create many Job_user_relations.
     * @example
     * // Create many Job_user_relations
     * const job_user_relation = await prisma.job_user_relation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends job_user_relationCreateManyArgs>(args?: SelectSubset<T, job_user_relationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Job_user_relations and returns the data saved in the database.
     * @param {job_user_relationCreateManyAndReturnArgs} args - Arguments to create many Job_user_relations.
     * @example
     * // Create many Job_user_relations
     * const job_user_relation = await prisma.job_user_relation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Job_user_relations and only return the `topic_id`
     * const job_user_relationWithTopic_idOnly = await prisma.job_user_relation.createManyAndReturn({ 
     *   select: { topic_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends job_user_relationCreateManyAndReturnArgs>(args?: SelectSubset<T, job_user_relationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$job_user_relationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Job_user_relation.
     * @param {job_user_relationDeleteArgs} args - Arguments to delete one Job_user_relation.
     * @example
     * // Delete one Job_user_relation
     * const Job_user_relation = await prisma.job_user_relation.delete({
     *   where: {
     *     // ... filter to delete one Job_user_relation
     *   }
     * })
     * 
     */
    delete<T extends job_user_relationDeleteArgs>(args: SelectSubset<T, job_user_relationDeleteArgs<ExtArgs>>): Prisma__job_user_relationClient<$Result.GetResult<Prisma.$job_user_relationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Job_user_relation.
     * @param {job_user_relationUpdateArgs} args - Arguments to update one Job_user_relation.
     * @example
     * // Update one Job_user_relation
     * const job_user_relation = await prisma.job_user_relation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends job_user_relationUpdateArgs>(args: SelectSubset<T, job_user_relationUpdateArgs<ExtArgs>>): Prisma__job_user_relationClient<$Result.GetResult<Prisma.$job_user_relationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Job_user_relations.
     * @param {job_user_relationDeleteManyArgs} args - Arguments to filter Job_user_relations to delete.
     * @example
     * // Delete a few Job_user_relations
     * const { count } = await prisma.job_user_relation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends job_user_relationDeleteManyArgs>(args?: SelectSubset<T, job_user_relationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Job_user_relations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {job_user_relationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Job_user_relations
     * const job_user_relation = await prisma.job_user_relation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends job_user_relationUpdateManyArgs>(args: SelectSubset<T, job_user_relationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Job_user_relation.
     * @param {job_user_relationUpsertArgs} args - Arguments to update or create a Job_user_relation.
     * @example
     * // Update or create a Job_user_relation
     * const job_user_relation = await prisma.job_user_relation.upsert({
     *   create: {
     *     // ... data to create a Job_user_relation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Job_user_relation we want to update
     *   }
     * })
     */
    upsert<T extends job_user_relationUpsertArgs>(args: SelectSubset<T, job_user_relationUpsertArgs<ExtArgs>>): Prisma__job_user_relationClient<$Result.GetResult<Prisma.$job_user_relationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Job_user_relations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {job_user_relationCountArgs} args - Arguments to filter Job_user_relations to count.
     * @example
     * // Count the number of Job_user_relations
     * const count = await prisma.job_user_relation.count({
     *   where: {
     *     // ... the filter for the Job_user_relations we want to count
     *   }
     * })
    **/
    count<T extends job_user_relationCountArgs>(
      args?: Subset<T, job_user_relationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Job_user_relationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Job_user_relation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Job_user_relationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends Job_user_relationAggregateArgs>(args: Subset<T, Job_user_relationAggregateArgs>): Prisma.PrismaPromise<GetJob_user_relationAggregateType<T>>

    /**
     * Group by Job_user_relation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {job_user_relationGroupByArgs} args - Group by arguments.
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
      T extends job_user_relationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: job_user_relationGroupByArgs['orderBy'] }
        : { orderBy?: job_user_relationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, job_user_relationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetJob_user_relationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the job_user_relation model
   */
  readonly fields: job_user_relationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for job_user_relation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__job_user_relationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
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
   * Fields of the job_user_relation model
   */ 
  interface job_user_relationFieldRefs {
    readonly topic_id: FieldRef<"job_user_relation", 'String'>
    readonly user_id: FieldRef<"job_user_relation", 'BigInt'>
    readonly ffrom: FieldRef<"job_user_relation", 'String'>
  }
    

  // Custom InputTypes
  /**
   * job_user_relation findUnique
   */
  export type job_user_relationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_user_relation
     */
    select?: job_user_relationSelect<ExtArgs> | null
    /**
     * Filter, which job_user_relation to fetch.
     */
    where: job_user_relationWhereUniqueInput
  }

  /**
   * job_user_relation findUniqueOrThrow
   */
  export type job_user_relationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_user_relation
     */
    select?: job_user_relationSelect<ExtArgs> | null
    /**
     * Filter, which job_user_relation to fetch.
     */
    where: job_user_relationWhereUniqueInput
  }

  /**
   * job_user_relation findFirst
   */
  export type job_user_relationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_user_relation
     */
    select?: job_user_relationSelect<ExtArgs> | null
    /**
     * Filter, which job_user_relation to fetch.
     */
    where?: job_user_relationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of job_user_relations to fetch.
     */
    orderBy?: job_user_relationOrderByWithRelationInput | job_user_relationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for job_user_relations.
     */
    cursor?: job_user_relationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` job_user_relations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` job_user_relations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of job_user_relations.
     */
    distinct?: Job_user_relationScalarFieldEnum | Job_user_relationScalarFieldEnum[]
  }

  /**
   * job_user_relation findFirstOrThrow
   */
  export type job_user_relationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_user_relation
     */
    select?: job_user_relationSelect<ExtArgs> | null
    /**
     * Filter, which job_user_relation to fetch.
     */
    where?: job_user_relationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of job_user_relations to fetch.
     */
    orderBy?: job_user_relationOrderByWithRelationInput | job_user_relationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for job_user_relations.
     */
    cursor?: job_user_relationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` job_user_relations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` job_user_relations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of job_user_relations.
     */
    distinct?: Job_user_relationScalarFieldEnum | Job_user_relationScalarFieldEnum[]
  }

  /**
   * job_user_relation findMany
   */
  export type job_user_relationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_user_relation
     */
    select?: job_user_relationSelect<ExtArgs> | null
    /**
     * Filter, which job_user_relations to fetch.
     */
    where?: job_user_relationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of job_user_relations to fetch.
     */
    orderBy?: job_user_relationOrderByWithRelationInput | job_user_relationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing job_user_relations.
     */
    cursor?: job_user_relationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` job_user_relations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` job_user_relations.
     */
    skip?: number
    distinct?: Job_user_relationScalarFieldEnum | Job_user_relationScalarFieldEnum[]
  }

  /**
   * job_user_relation create
   */
  export type job_user_relationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_user_relation
     */
    select?: job_user_relationSelect<ExtArgs> | null
    /**
     * The data needed to create a job_user_relation.
     */
    data: XOR<job_user_relationCreateInput, job_user_relationUncheckedCreateInput>
  }

  /**
   * job_user_relation createMany
   */
  export type job_user_relationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many job_user_relations.
     */
    data: job_user_relationCreateManyInput | job_user_relationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * job_user_relation createManyAndReturn
   */
  export type job_user_relationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_user_relation
     */
    select?: job_user_relationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many job_user_relations.
     */
    data: job_user_relationCreateManyInput | job_user_relationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * job_user_relation update
   */
  export type job_user_relationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_user_relation
     */
    select?: job_user_relationSelect<ExtArgs> | null
    /**
     * The data needed to update a job_user_relation.
     */
    data: XOR<job_user_relationUpdateInput, job_user_relationUncheckedUpdateInput>
    /**
     * Choose, which job_user_relation to update.
     */
    where: job_user_relationWhereUniqueInput
  }

  /**
   * job_user_relation updateMany
   */
  export type job_user_relationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update job_user_relations.
     */
    data: XOR<job_user_relationUpdateManyMutationInput, job_user_relationUncheckedUpdateManyInput>
    /**
     * Filter which job_user_relations to update
     */
    where?: job_user_relationWhereInput
  }

  /**
   * job_user_relation upsert
   */
  export type job_user_relationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_user_relation
     */
    select?: job_user_relationSelect<ExtArgs> | null
    /**
     * The filter to search for the job_user_relation to update in case it exists.
     */
    where: job_user_relationWhereUniqueInput
    /**
     * In case the job_user_relation found by the `where` argument doesn't exist, create a new job_user_relation with this data.
     */
    create: XOR<job_user_relationCreateInput, job_user_relationUncheckedCreateInput>
    /**
     * In case the job_user_relation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<job_user_relationUpdateInput, job_user_relationUncheckedUpdateInput>
  }

  /**
   * job_user_relation delete
   */
  export type job_user_relationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_user_relation
     */
    select?: job_user_relationSelect<ExtArgs> | null
    /**
     * Filter which job_user_relation to delete.
     */
    where: job_user_relationWhereUniqueInput
  }

  /**
   * job_user_relation deleteMany
   */
  export type job_user_relationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which job_user_relations to delete
     */
    where?: job_user_relationWhereInput
  }

  /**
   * job_user_relation without action
   */
  export type job_user_relationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the job_user_relation
     */
    select?: job_user_relationSelect<ExtArgs> | null
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


  export const UserScalarFieldEnum: {
    id: 'id',
    address: 'address',
    nickname: 'nickname',
    email: 'email',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const JobScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    jobType: 'jobType',
    weights: 'weights',
    parsedRequirements: 'parsedRequirements',
    vectorMetadata: 'vectorMetadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type JobScalarFieldEnum = (typeof JobScalarFieldEnum)[keyof typeof JobScalarFieldEnum]


  export const ResumeScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    content: 'content',
    title: 'title',
    filename: 'filename',
    filetype: 'filetype',
    filesize: 'filesize',
    parsedData: 'parsedData',
    vectorId: 'vectorId',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ResumeScalarFieldEnum = (typeof ResumeScalarFieldEnum)[keyof typeof ResumeScalarFieldEnum]


  export const ResumeAnalysisScalarFieldEnum: {
    id: 'id',
    jobId: 'jobId',
    resumeContent: 'resumeContent',
    parsedResume: 'parsedResume',
    totalScore: 'totalScore',
    skillScore: 'skillScore',
    experienceScore: 'experienceScore',
    matchingPoints: 'matchingPoints',
    suggestions: 'suggestions',
    recommended: 'recommended',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ResumeAnalysisScalarFieldEnum = (typeof ResumeAnalysisScalarFieldEnum)[keyof typeof ResumeAnalysisScalarFieldEnum]


  export const ApplicationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    jobId: 'jobId',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type ApplicationScalarFieldEnum = (typeof ApplicationScalarFieldEnum)[keyof typeof ApplicationScalarFieldEnum]


  export const NFTProofScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    nftType: 'nftType',
    tokenId: 'tokenId',
    txHash: 'txHash',
    mintedAt: 'mintedAt'
  };

  export type NFTProofScalarFieldEnum = (typeof NFTProofScalarFieldEnum)[keyof typeof NFTProofScalarFieldEnum]


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


  export const Job_user_relationScalarFieldEnum: {
    topic_id: 'topic_id',
    user_id: 'user_id',
    ffrom: 'ffrom'
  };

  export type Job_user_relationScalarFieldEnum = (typeof Job_user_relationScalarFieldEnum)[keyof typeof Job_user_relationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


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


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    address?: StringFilter<"User"> | string
    nickname?: StringNullableFilter<"User"> | string | null
    email?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    applications?: ApplicationListRelationFilter
    nftProofs?: NFTProofListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    address?: SortOrder
    nickname?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    applications?: ApplicationOrderByRelationAggregateInput
    nftProofs?: NFTProofOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    address?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    nickname?: StringNullableFilter<"User"> | string | null
    email?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    applications?: ApplicationListRelationFilter
    nftProofs?: NFTProofListRelationFilter
  }, "id" | "address">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    address?: SortOrder
    nickname?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    address?: StringWithAggregatesFilter<"User"> | string
    nickname?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type JobWhereInput = {
    AND?: JobWhereInput | JobWhereInput[]
    OR?: JobWhereInput[]
    NOT?: JobWhereInput | JobWhereInput[]
    id?: StringFilter<"Job"> | string
    title?: StringFilter<"Job"> | string
    description?: StringFilter<"Job"> | string
    jobType?: StringFilter<"Job"> | string
    weights?: JsonFilter<"Job">
    parsedRequirements?: JsonFilter<"Job">
    vectorMetadata?: JsonNullableFilter<"Job">
    createdAt?: DateTimeFilter<"Job"> | Date | string
    updatedAt?: DateTimeFilter<"Job"> | Date | string
    applications?: ApplicationListRelationFilter
    resumeAnalyses?: ResumeAnalysisListRelationFilter
  }

  export type JobOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    jobType?: SortOrder
    weights?: SortOrder
    parsedRequirements?: SortOrder
    vectorMetadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    applications?: ApplicationOrderByRelationAggregateInput
    resumeAnalyses?: ResumeAnalysisOrderByRelationAggregateInput
  }

  export type JobWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: JobWhereInput | JobWhereInput[]
    OR?: JobWhereInput[]
    NOT?: JobWhereInput | JobWhereInput[]
    title?: StringFilter<"Job"> | string
    description?: StringFilter<"Job"> | string
    jobType?: StringFilter<"Job"> | string
    weights?: JsonFilter<"Job">
    parsedRequirements?: JsonFilter<"Job">
    vectorMetadata?: JsonNullableFilter<"Job">
    createdAt?: DateTimeFilter<"Job"> | Date | string
    updatedAt?: DateTimeFilter<"Job"> | Date | string
    applications?: ApplicationListRelationFilter
    resumeAnalyses?: ResumeAnalysisListRelationFilter
  }, "id">

  export type JobOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    jobType?: SortOrder
    weights?: SortOrder
    parsedRequirements?: SortOrder
    vectorMetadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: JobCountOrderByAggregateInput
    _max?: JobMaxOrderByAggregateInput
    _min?: JobMinOrderByAggregateInput
  }

  export type JobScalarWhereWithAggregatesInput = {
    AND?: JobScalarWhereWithAggregatesInput | JobScalarWhereWithAggregatesInput[]
    OR?: JobScalarWhereWithAggregatesInput[]
    NOT?: JobScalarWhereWithAggregatesInput | JobScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Job"> | string
    title?: StringWithAggregatesFilter<"Job"> | string
    description?: StringWithAggregatesFilter<"Job"> | string
    jobType?: StringWithAggregatesFilter<"Job"> | string
    weights?: JsonWithAggregatesFilter<"Job">
    parsedRequirements?: JsonWithAggregatesFilter<"Job">
    vectorMetadata?: JsonNullableWithAggregatesFilter<"Job">
    createdAt?: DateTimeWithAggregatesFilter<"Job"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Job"> | Date | string
  }

  export type ResumeWhereInput = {
    AND?: ResumeWhereInput | ResumeWhereInput[]
    OR?: ResumeWhereInput[]
    NOT?: ResumeWhereInput | ResumeWhereInput[]
    id?: StringFilter<"Resume"> | string
    userId?: StringFilter<"Resume"> | string
    content?: StringFilter<"Resume"> | string
    title?: StringNullableFilter<"Resume"> | string | null
    filename?: StringNullableFilter<"Resume"> | string | null
    filetype?: StringNullableFilter<"Resume"> | string | null
    filesize?: IntNullableFilter<"Resume"> | number | null
    parsedData?: JsonNullableFilter<"Resume">
    vectorId?: StringNullableFilter<"Resume"> | string | null
    status?: StringNullableFilter<"Resume"> | string | null
    createdAt?: DateTimeNullableFilter<"Resume"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Resume"> | Date | string | null
  }

  export type ResumeOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    title?: SortOrderInput | SortOrder
    filename?: SortOrderInput | SortOrder
    filetype?: SortOrderInput | SortOrder
    filesize?: SortOrderInput | SortOrder
    parsedData?: SortOrderInput | SortOrder
    vectorId?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
  }

  export type ResumeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ResumeWhereInput | ResumeWhereInput[]
    OR?: ResumeWhereInput[]
    NOT?: ResumeWhereInput | ResumeWhereInput[]
    userId?: StringFilter<"Resume"> | string
    content?: StringFilter<"Resume"> | string
    title?: StringNullableFilter<"Resume"> | string | null
    filename?: StringNullableFilter<"Resume"> | string | null
    filetype?: StringNullableFilter<"Resume"> | string | null
    filesize?: IntNullableFilter<"Resume"> | number | null
    parsedData?: JsonNullableFilter<"Resume">
    vectorId?: StringNullableFilter<"Resume"> | string | null
    status?: StringNullableFilter<"Resume"> | string | null
    createdAt?: DateTimeNullableFilter<"Resume"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Resume"> | Date | string | null
  }, "id">

  export type ResumeOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    title?: SortOrderInput | SortOrder
    filename?: SortOrderInput | SortOrder
    filetype?: SortOrderInput | SortOrder
    filesize?: SortOrderInput | SortOrder
    parsedData?: SortOrderInput | SortOrder
    vectorId?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    _count?: ResumeCountOrderByAggregateInput
    _avg?: ResumeAvgOrderByAggregateInput
    _max?: ResumeMaxOrderByAggregateInput
    _min?: ResumeMinOrderByAggregateInput
    _sum?: ResumeSumOrderByAggregateInput
  }

  export type ResumeScalarWhereWithAggregatesInput = {
    AND?: ResumeScalarWhereWithAggregatesInput | ResumeScalarWhereWithAggregatesInput[]
    OR?: ResumeScalarWhereWithAggregatesInput[]
    NOT?: ResumeScalarWhereWithAggregatesInput | ResumeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Resume"> | string
    userId?: StringWithAggregatesFilter<"Resume"> | string
    content?: StringWithAggregatesFilter<"Resume"> | string
    title?: StringNullableWithAggregatesFilter<"Resume"> | string | null
    filename?: StringNullableWithAggregatesFilter<"Resume"> | string | null
    filetype?: StringNullableWithAggregatesFilter<"Resume"> | string | null
    filesize?: IntNullableWithAggregatesFilter<"Resume"> | number | null
    parsedData?: JsonNullableWithAggregatesFilter<"Resume">
    vectorId?: StringNullableWithAggregatesFilter<"Resume"> | string | null
    status?: StringNullableWithAggregatesFilter<"Resume"> | string | null
    createdAt?: DateTimeNullableWithAggregatesFilter<"Resume"> | Date | string | null
    updatedAt?: DateTimeNullableWithAggregatesFilter<"Resume"> | Date | string | null
  }

  export type ResumeAnalysisWhereInput = {
    AND?: ResumeAnalysisWhereInput | ResumeAnalysisWhereInput[]
    OR?: ResumeAnalysisWhereInput[]
    NOT?: ResumeAnalysisWhereInput | ResumeAnalysisWhereInput[]
    id?: StringFilter<"ResumeAnalysis"> | string
    jobId?: StringFilter<"ResumeAnalysis"> | string
    resumeContent?: StringFilter<"ResumeAnalysis"> | string
    parsedResume?: JsonFilter<"ResumeAnalysis">
    totalScore?: FloatFilter<"ResumeAnalysis"> | number
    skillScore?: FloatFilter<"ResumeAnalysis"> | number
    experienceScore?: FloatFilter<"ResumeAnalysis"> | number
    matchingPoints?: JsonFilter<"ResumeAnalysis">
    suggestions?: JsonFilter<"ResumeAnalysis">
    recommended?: BoolFilter<"ResumeAnalysis"> | boolean
    createdAt?: DateTimeFilter<"ResumeAnalysis"> | Date | string
    updatedAt?: DateTimeFilter<"ResumeAnalysis"> | Date | string
    job?: XOR<JobRelationFilter, JobWhereInput>
  }

  export type ResumeAnalysisOrderByWithRelationInput = {
    id?: SortOrder
    jobId?: SortOrder
    resumeContent?: SortOrder
    parsedResume?: SortOrder
    totalScore?: SortOrder
    skillScore?: SortOrder
    experienceScore?: SortOrder
    matchingPoints?: SortOrder
    suggestions?: SortOrder
    recommended?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    job?: JobOrderByWithRelationInput
  }

  export type ResumeAnalysisWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ResumeAnalysisWhereInput | ResumeAnalysisWhereInput[]
    OR?: ResumeAnalysisWhereInput[]
    NOT?: ResumeAnalysisWhereInput | ResumeAnalysisWhereInput[]
    jobId?: StringFilter<"ResumeAnalysis"> | string
    resumeContent?: StringFilter<"ResumeAnalysis"> | string
    parsedResume?: JsonFilter<"ResumeAnalysis">
    totalScore?: FloatFilter<"ResumeAnalysis"> | number
    skillScore?: FloatFilter<"ResumeAnalysis"> | number
    experienceScore?: FloatFilter<"ResumeAnalysis"> | number
    matchingPoints?: JsonFilter<"ResumeAnalysis">
    suggestions?: JsonFilter<"ResumeAnalysis">
    recommended?: BoolFilter<"ResumeAnalysis"> | boolean
    createdAt?: DateTimeFilter<"ResumeAnalysis"> | Date | string
    updatedAt?: DateTimeFilter<"ResumeAnalysis"> | Date | string
    job?: XOR<JobRelationFilter, JobWhereInput>
  }, "id">

  export type ResumeAnalysisOrderByWithAggregationInput = {
    id?: SortOrder
    jobId?: SortOrder
    resumeContent?: SortOrder
    parsedResume?: SortOrder
    totalScore?: SortOrder
    skillScore?: SortOrder
    experienceScore?: SortOrder
    matchingPoints?: SortOrder
    suggestions?: SortOrder
    recommended?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ResumeAnalysisCountOrderByAggregateInput
    _avg?: ResumeAnalysisAvgOrderByAggregateInput
    _max?: ResumeAnalysisMaxOrderByAggregateInput
    _min?: ResumeAnalysisMinOrderByAggregateInput
    _sum?: ResumeAnalysisSumOrderByAggregateInput
  }

  export type ResumeAnalysisScalarWhereWithAggregatesInput = {
    AND?: ResumeAnalysisScalarWhereWithAggregatesInput | ResumeAnalysisScalarWhereWithAggregatesInput[]
    OR?: ResumeAnalysisScalarWhereWithAggregatesInput[]
    NOT?: ResumeAnalysisScalarWhereWithAggregatesInput | ResumeAnalysisScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ResumeAnalysis"> | string
    jobId?: StringWithAggregatesFilter<"ResumeAnalysis"> | string
    resumeContent?: StringWithAggregatesFilter<"ResumeAnalysis"> | string
    parsedResume?: JsonWithAggregatesFilter<"ResumeAnalysis">
    totalScore?: FloatWithAggregatesFilter<"ResumeAnalysis"> | number
    skillScore?: FloatWithAggregatesFilter<"ResumeAnalysis"> | number
    experienceScore?: FloatWithAggregatesFilter<"ResumeAnalysis"> | number
    matchingPoints?: JsonWithAggregatesFilter<"ResumeAnalysis">
    suggestions?: JsonWithAggregatesFilter<"ResumeAnalysis">
    recommended?: BoolWithAggregatesFilter<"ResumeAnalysis"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"ResumeAnalysis"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ResumeAnalysis"> | Date | string
  }

  export type ApplicationWhereInput = {
    AND?: ApplicationWhereInput | ApplicationWhereInput[]
    OR?: ApplicationWhereInput[]
    NOT?: ApplicationWhereInput | ApplicationWhereInput[]
    id?: StringFilter<"Application"> | string
    userId?: StringFilter<"Application"> | string
    jobId?: StringFilter<"Application"> | string
    status?: StringFilter<"Application"> | string
    createdAt?: DateTimeFilter<"Application"> | Date | string
    job?: XOR<JobRelationFilter, JobWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type ApplicationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    jobId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    job?: JobOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type ApplicationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ApplicationWhereInput | ApplicationWhereInput[]
    OR?: ApplicationWhereInput[]
    NOT?: ApplicationWhereInput | ApplicationWhereInput[]
    userId?: StringFilter<"Application"> | string
    jobId?: StringFilter<"Application"> | string
    status?: StringFilter<"Application"> | string
    createdAt?: DateTimeFilter<"Application"> | Date | string
    job?: XOR<JobRelationFilter, JobWhereInput>
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type ApplicationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    jobId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: ApplicationCountOrderByAggregateInput
    _max?: ApplicationMaxOrderByAggregateInput
    _min?: ApplicationMinOrderByAggregateInput
  }

  export type ApplicationScalarWhereWithAggregatesInput = {
    AND?: ApplicationScalarWhereWithAggregatesInput | ApplicationScalarWhereWithAggregatesInput[]
    OR?: ApplicationScalarWhereWithAggregatesInput[]
    NOT?: ApplicationScalarWhereWithAggregatesInput | ApplicationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Application"> | string
    userId?: StringWithAggregatesFilter<"Application"> | string
    jobId?: StringWithAggregatesFilter<"Application"> | string
    status?: StringWithAggregatesFilter<"Application"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Application"> | Date | string
  }

  export type NFTProofWhereInput = {
    AND?: NFTProofWhereInput | NFTProofWhereInput[]
    OR?: NFTProofWhereInput[]
    NOT?: NFTProofWhereInput | NFTProofWhereInput[]
    id?: StringFilter<"NFTProof"> | string
    userId?: StringFilter<"NFTProof"> | string
    nftType?: StringFilter<"NFTProof"> | string
    tokenId?: StringFilter<"NFTProof"> | string
    txHash?: StringFilter<"NFTProof"> | string
    mintedAt?: DateTimeFilter<"NFTProof"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type NFTProofOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    nftType?: SortOrder
    tokenId?: SortOrder
    txHash?: SortOrder
    mintedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type NFTProofWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NFTProofWhereInput | NFTProofWhereInput[]
    OR?: NFTProofWhereInput[]
    NOT?: NFTProofWhereInput | NFTProofWhereInput[]
    userId?: StringFilter<"NFTProof"> | string
    nftType?: StringFilter<"NFTProof"> | string
    tokenId?: StringFilter<"NFTProof"> | string
    txHash?: StringFilter<"NFTProof"> | string
    mintedAt?: DateTimeFilter<"NFTProof"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type NFTProofOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    nftType?: SortOrder
    tokenId?: SortOrder
    txHash?: SortOrder
    mintedAt?: SortOrder
    _count?: NFTProofCountOrderByAggregateInput
    _max?: NFTProofMaxOrderByAggregateInput
    _min?: NFTProofMinOrderByAggregateInput
  }

  export type NFTProofScalarWhereWithAggregatesInput = {
    AND?: NFTProofScalarWhereWithAggregatesInput | NFTProofScalarWhereWithAggregatesInput[]
    OR?: NFTProofScalarWhereWithAggregatesInput[]
    NOT?: NFTProofScalarWhereWithAggregatesInput | NFTProofScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"NFTProof"> | string
    userId?: StringWithAggregatesFilter<"NFTProof"> | string
    nftType?: StringWithAggregatesFilter<"NFTProof"> | string
    tokenId?: StringWithAggregatesFilter<"NFTProof"> | string
    txHash?: StringWithAggregatesFilter<"NFTProof"> | string
    mintedAt?: DateTimeWithAggregatesFilter<"NFTProof"> | Date | string
  }

  export type job_postingWhereInput = {
    AND?: job_postingWhereInput | job_postingWhereInput[]
    OR?: job_postingWhereInput[]
    NOT?: job_postingWhereInput | job_postingWhereInput[]
    topic_id?: StringFilter<"job_posting"> | string
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
    topic_id?: string
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
    topic_id?: StringWithAggregatesFilter<"job_posting"> | string
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
    topic_id?: StringFilter<"job_tag_relation"> | string
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
    topic_id?: StringFilter<"job_tag_relation"> | string
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
    topic_id?: StringWithAggregatesFilter<"job_tag_relation"> | string
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

  export type job_user_relationWhereInput = {
    AND?: job_user_relationWhereInput | job_user_relationWhereInput[]
    OR?: job_user_relationWhereInput[]
    NOT?: job_user_relationWhereInput | job_user_relationWhereInput[]
    topic_id?: StringFilter<"job_user_relation"> | string
    user_id?: BigIntFilter<"job_user_relation"> | bigint | number
    ffrom?: StringNullableFilter<"job_user_relation"> | string | null
  }

  export type job_user_relationOrderByWithRelationInput = {
    topic_id?: SortOrder
    user_id?: SortOrder
    ffrom?: SortOrderInput | SortOrder
  }

  export type job_user_relationWhereUniqueInput = Prisma.AtLeast<{
    topic_id_user_id?: job_user_relationTopic_idUser_idCompoundUniqueInput
    AND?: job_user_relationWhereInput | job_user_relationWhereInput[]
    OR?: job_user_relationWhereInput[]
    NOT?: job_user_relationWhereInput | job_user_relationWhereInput[]
    topic_id?: StringFilter<"job_user_relation"> | string
    user_id?: BigIntFilter<"job_user_relation"> | bigint | number
    ffrom?: StringNullableFilter<"job_user_relation"> | string | null
  }, "topic_id_user_id">

  export type job_user_relationOrderByWithAggregationInput = {
    topic_id?: SortOrder
    user_id?: SortOrder
    ffrom?: SortOrderInput | SortOrder
    _count?: job_user_relationCountOrderByAggregateInput
    _avg?: job_user_relationAvgOrderByAggregateInput
    _max?: job_user_relationMaxOrderByAggregateInput
    _min?: job_user_relationMinOrderByAggregateInput
    _sum?: job_user_relationSumOrderByAggregateInput
  }

  export type job_user_relationScalarWhereWithAggregatesInput = {
    AND?: job_user_relationScalarWhereWithAggregatesInput | job_user_relationScalarWhereWithAggregatesInput[]
    OR?: job_user_relationScalarWhereWithAggregatesInput[]
    NOT?: job_user_relationScalarWhereWithAggregatesInput | job_user_relationScalarWhereWithAggregatesInput[]
    topic_id?: StringWithAggregatesFilter<"job_user_relation"> | string
    user_id?: BigIntWithAggregatesFilter<"job_user_relation"> | bigint | number
    ffrom?: StringNullableWithAggregatesFilter<"job_user_relation"> | string | null
  }

  export type UserCreateInput = {
    id?: string
    address: string
    nickname?: string | null
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationCreateNestedManyWithoutUserInput
    nftProofs?: NFTProofCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    address: string
    nickname?: string | null
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationUncheckedCreateNestedManyWithoutUserInput
    nftProofs?: NFTProofUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUpdateManyWithoutUserNestedInput
    nftProofs?: NFTProofUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUncheckedUpdateManyWithoutUserNestedInput
    nftProofs?: NFTProofUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    address: string
    nickname?: string | null
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobCreateInput = {
    id?: string
    title: string
    description: string
    jobType: string
    weights: JsonNullValueInput | InputJsonValue
    parsedRequirements: JsonNullValueInput | InputJsonValue
    vectorMetadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationCreateNestedManyWithoutJobInput
    resumeAnalyses?: ResumeAnalysisCreateNestedManyWithoutJobInput
  }

  export type JobUncheckedCreateInput = {
    id?: string
    title: string
    description: string
    jobType: string
    weights: JsonNullValueInput | InputJsonValue
    parsedRequirements: JsonNullValueInput | InputJsonValue
    vectorMetadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationUncheckedCreateNestedManyWithoutJobInput
    resumeAnalyses?: ResumeAnalysisUncheckedCreateNestedManyWithoutJobInput
  }

  export type JobUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    jobType?: StringFieldUpdateOperationsInput | string
    weights?: JsonNullValueInput | InputJsonValue
    parsedRequirements?: JsonNullValueInput | InputJsonValue
    vectorMetadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUpdateManyWithoutJobNestedInput
    resumeAnalyses?: ResumeAnalysisUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    jobType?: StringFieldUpdateOperationsInput | string
    weights?: JsonNullValueInput | InputJsonValue
    parsedRequirements?: JsonNullValueInput | InputJsonValue
    vectorMetadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUncheckedUpdateManyWithoutJobNestedInput
    resumeAnalyses?: ResumeAnalysisUncheckedUpdateManyWithoutJobNestedInput
  }

  export type JobCreateManyInput = {
    id?: string
    title: string
    description: string
    jobType: string
    weights: JsonNullValueInput | InputJsonValue
    parsedRequirements: JsonNullValueInput | InputJsonValue
    vectorMetadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type JobUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    jobType?: StringFieldUpdateOperationsInput | string
    weights?: JsonNullValueInput | InputJsonValue
    parsedRequirements?: JsonNullValueInput | InputJsonValue
    vectorMetadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type JobUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    jobType?: StringFieldUpdateOperationsInput | string
    weights?: JsonNullValueInput | InputJsonValue
    parsedRequirements?: JsonNullValueInput | InputJsonValue
    vectorMetadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResumeCreateInput = {
    id?: string
    userId: string
    content: string
    title?: string | null
    filename?: string | null
    filetype?: string | null
    filesize?: number | null
    parsedData?: NullableJsonNullValueInput | InputJsonValue
    vectorId?: string | null
    status?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type ResumeUncheckedCreateInput = {
    id?: string
    userId: string
    content: string
    title?: string | null
    filename?: string | null
    filetype?: string | null
    filesize?: number | null
    parsedData?: NullableJsonNullValueInput | InputJsonValue
    vectorId?: string | null
    status?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type ResumeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    filename?: NullableStringFieldUpdateOperationsInput | string | null
    filetype?: NullableStringFieldUpdateOperationsInput | string | null
    filesize?: NullableIntFieldUpdateOperationsInput | number | null
    parsedData?: NullableJsonNullValueInput | InputJsonValue
    vectorId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ResumeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    filename?: NullableStringFieldUpdateOperationsInput | string | null
    filetype?: NullableStringFieldUpdateOperationsInput | string | null
    filesize?: NullableIntFieldUpdateOperationsInput | number | null
    parsedData?: NullableJsonNullValueInput | InputJsonValue
    vectorId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ResumeCreateManyInput = {
    id?: string
    userId: string
    content: string
    title?: string | null
    filename?: string | null
    filetype?: string | null
    filesize?: number | null
    parsedData?: NullableJsonNullValueInput | InputJsonValue
    vectorId?: string | null
    status?: string | null
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type ResumeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    filename?: NullableStringFieldUpdateOperationsInput | string | null
    filetype?: NullableStringFieldUpdateOperationsInput | string | null
    filesize?: NullableIntFieldUpdateOperationsInput | number | null
    parsedData?: NullableJsonNullValueInput | InputJsonValue
    vectorId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ResumeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    filename?: NullableStringFieldUpdateOperationsInput | string | null
    filetype?: NullableStringFieldUpdateOperationsInput | string | null
    filesize?: NullableIntFieldUpdateOperationsInput | number | null
    parsedData?: NullableJsonNullValueInput | InputJsonValue
    vectorId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ResumeAnalysisCreateInput = {
    id?: string
    resumeContent: string
    parsedResume: JsonNullValueInput | InputJsonValue
    totalScore: number
    skillScore: number
    experienceScore: number
    matchingPoints: JsonNullValueInput | InputJsonValue
    suggestions: JsonNullValueInput | InputJsonValue
    recommended: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    job: JobCreateNestedOneWithoutResumeAnalysesInput
  }

  export type ResumeAnalysisUncheckedCreateInput = {
    id?: string
    jobId: string
    resumeContent: string
    parsedResume: JsonNullValueInput | InputJsonValue
    totalScore: number
    skillScore: number
    experienceScore: number
    matchingPoints: JsonNullValueInput | InputJsonValue
    suggestions: JsonNullValueInput | InputJsonValue
    recommended: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ResumeAnalysisUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    resumeContent?: StringFieldUpdateOperationsInput | string
    parsedResume?: JsonNullValueInput | InputJsonValue
    totalScore?: FloatFieldUpdateOperationsInput | number
    skillScore?: FloatFieldUpdateOperationsInput | number
    experienceScore?: FloatFieldUpdateOperationsInput | number
    matchingPoints?: JsonNullValueInput | InputJsonValue
    suggestions?: JsonNullValueInput | InputJsonValue
    recommended?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    job?: JobUpdateOneRequiredWithoutResumeAnalysesNestedInput
  }

  export type ResumeAnalysisUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    resumeContent?: StringFieldUpdateOperationsInput | string
    parsedResume?: JsonNullValueInput | InputJsonValue
    totalScore?: FloatFieldUpdateOperationsInput | number
    skillScore?: FloatFieldUpdateOperationsInput | number
    experienceScore?: FloatFieldUpdateOperationsInput | number
    matchingPoints?: JsonNullValueInput | InputJsonValue
    suggestions?: JsonNullValueInput | InputJsonValue
    recommended?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResumeAnalysisCreateManyInput = {
    id?: string
    jobId: string
    resumeContent: string
    parsedResume: JsonNullValueInput | InputJsonValue
    totalScore: number
    skillScore: number
    experienceScore: number
    matchingPoints: JsonNullValueInput | InputJsonValue
    suggestions: JsonNullValueInput | InputJsonValue
    recommended: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ResumeAnalysisUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    resumeContent?: StringFieldUpdateOperationsInput | string
    parsedResume?: JsonNullValueInput | InputJsonValue
    totalScore?: FloatFieldUpdateOperationsInput | number
    skillScore?: FloatFieldUpdateOperationsInput | number
    experienceScore?: FloatFieldUpdateOperationsInput | number
    matchingPoints?: JsonNullValueInput | InputJsonValue
    suggestions?: JsonNullValueInput | InputJsonValue
    recommended?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResumeAnalysisUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    resumeContent?: StringFieldUpdateOperationsInput | string
    parsedResume?: JsonNullValueInput | InputJsonValue
    totalScore?: FloatFieldUpdateOperationsInput | number
    skillScore?: FloatFieldUpdateOperationsInput | number
    experienceScore?: FloatFieldUpdateOperationsInput | number
    matchingPoints?: JsonNullValueInput | InputJsonValue
    suggestions?: JsonNullValueInput | InputJsonValue
    recommended?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationCreateInput = {
    id?: string
    status: string
    createdAt?: Date | string
    job: JobCreateNestedOneWithoutApplicationsInput
    user: UserCreateNestedOneWithoutApplicationsInput
  }

  export type ApplicationUncheckedCreateInput = {
    id?: string
    userId: string
    jobId: string
    status: string
    createdAt?: Date | string
  }

  export type ApplicationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    job?: JobUpdateOneRequiredWithoutApplicationsNestedInput
    user?: UserUpdateOneRequiredWithoutApplicationsNestedInput
  }

  export type ApplicationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationCreateManyInput = {
    id?: string
    userId: string
    jobId: string
    status: string
    createdAt?: Date | string
  }

  export type ApplicationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NFTProofCreateInput = {
    id?: string
    nftType: string
    tokenId: string
    txHash: string
    mintedAt: Date | string
    user: UserCreateNestedOneWithoutNftProofsInput
  }

  export type NFTProofUncheckedCreateInput = {
    id?: string
    userId: string
    nftType: string
    tokenId: string
    txHash: string
    mintedAt: Date | string
  }

  export type NFTProofUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nftType?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    mintedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNftProofsNestedInput
  }

  export type NFTProofUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    nftType?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    mintedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NFTProofCreateManyInput = {
    id?: string
    userId: string
    nftType: string
    tokenId: string
    txHash: string
    mintedAt: Date | string
  }

  export type NFTProofUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nftType?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    mintedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NFTProofUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    nftType?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    mintedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type job_postingCreateInput = {
    topic_id: string
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
    topic_id: string
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
    topic_id?: StringFieldUpdateOperationsInput | string
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
    topic_id?: StringFieldUpdateOperationsInput | string
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
    topic_id: string
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
    topic_id?: StringFieldUpdateOperationsInput | string
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
    topic_id?: StringFieldUpdateOperationsInput | string
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
    topic_id: string
    tag_id: bigint | number
    ffrom?: string | null
  }

  export type job_tag_relationUncheckedCreateInput = {
    topic_id: string
    tag_id: bigint | number
    ffrom?: string | null
  }

  export type job_tag_relationUpdateInput = {
    topic_id?: StringFieldUpdateOperationsInput | string
    tag_id?: BigIntFieldUpdateOperationsInput | bigint | number
    ffrom?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type job_tag_relationUncheckedUpdateInput = {
    topic_id?: StringFieldUpdateOperationsInput | string
    tag_id?: BigIntFieldUpdateOperationsInput | bigint | number
    ffrom?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type job_tag_relationCreateManyInput = {
    topic_id: string
    tag_id: bigint | number
    ffrom?: string | null
  }

  export type job_tag_relationUpdateManyMutationInput = {
    topic_id?: StringFieldUpdateOperationsInput | string
    tag_id?: BigIntFieldUpdateOperationsInput | bigint | number
    ffrom?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type job_tag_relationUncheckedUpdateManyInput = {
    topic_id?: StringFieldUpdateOperationsInput | string
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

  export type job_user_relationCreateInput = {
    topic_id: string
    user_id: bigint | number
    ffrom?: string | null
  }

  export type job_user_relationUncheckedCreateInput = {
    topic_id: string
    user_id: bigint | number
    ffrom?: string | null
  }

  export type job_user_relationUpdateInput = {
    topic_id?: StringFieldUpdateOperationsInput | string
    user_id?: BigIntFieldUpdateOperationsInput | bigint | number
    ffrom?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type job_user_relationUncheckedUpdateInput = {
    topic_id?: StringFieldUpdateOperationsInput | string
    user_id?: BigIntFieldUpdateOperationsInput | bigint | number
    ffrom?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type job_user_relationCreateManyInput = {
    topic_id: string
    user_id: bigint | number
    ffrom?: string | null
  }

  export type job_user_relationUpdateManyMutationInput = {
    topic_id?: StringFieldUpdateOperationsInput | string
    user_id?: BigIntFieldUpdateOperationsInput | bigint | number
    ffrom?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type job_user_relationUncheckedUpdateManyInput = {
    topic_id?: StringFieldUpdateOperationsInput | string
    user_id?: BigIntFieldUpdateOperationsInput | bigint | number
    ffrom?: NullableStringFieldUpdateOperationsInput | string | null
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

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ApplicationListRelationFilter = {
    every?: ApplicationWhereInput
    some?: ApplicationWhereInput
    none?: ApplicationWhereInput
  }

  export type NFTProofListRelationFilter = {
    every?: NFTProofWhereInput
    some?: NFTProofWhereInput
    none?: NFTProofWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ApplicationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NFTProofOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    address?: SortOrder
    nickname?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    address?: SortOrder
    nickname?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    address?: SortOrder
    nickname?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ResumeAnalysisListRelationFilter = {
    every?: ResumeAnalysisWhereInput
    some?: ResumeAnalysisWhereInput
    none?: ResumeAnalysisWhereInput
  }

  export type ResumeAnalysisOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type JobCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    jobType?: SortOrder
    weights?: SortOrder
    parsedRequirements?: SortOrder
    vectorMetadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type JobMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    jobType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type JobMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    jobType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
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

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type ResumeCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    title?: SortOrder
    filename?: SortOrder
    filetype?: SortOrder
    filesize?: SortOrder
    parsedData?: SortOrder
    vectorId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ResumeAvgOrderByAggregateInput = {
    filesize?: SortOrder
  }

  export type ResumeMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    title?: SortOrder
    filename?: SortOrder
    filetype?: SortOrder
    filesize?: SortOrder
    vectorId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ResumeMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    content?: SortOrder
    title?: SortOrder
    filename?: SortOrder
    filetype?: SortOrder
    filesize?: SortOrder
    vectorId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ResumeSumOrderByAggregateInput = {
    filesize?: SortOrder
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

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type JobRelationFilter = {
    is?: JobWhereInput
    isNot?: JobWhereInput
  }

  export type ResumeAnalysisCountOrderByAggregateInput = {
    id?: SortOrder
    jobId?: SortOrder
    resumeContent?: SortOrder
    parsedResume?: SortOrder
    totalScore?: SortOrder
    skillScore?: SortOrder
    experienceScore?: SortOrder
    matchingPoints?: SortOrder
    suggestions?: SortOrder
    recommended?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ResumeAnalysisAvgOrderByAggregateInput = {
    totalScore?: SortOrder
    skillScore?: SortOrder
    experienceScore?: SortOrder
  }

  export type ResumeAnalysisMaxOrderByAggregateInput = {
    id?: SortOrder
    jobId?: SortOrder
    resumeContent?: SortOrder
    totalScore?: SortOrder
    skillScore?: SortOrder
    experienceScore?: SortOrder
    recommended?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ResumeAnalysisMinOrderByAggregateInput = {
    id?: SortOrder
    jobId?: SortOrder
    resumeContent?: SortOrder
    totalScore?: SortOrder
    skillScore?: SortOrder
    experienceScore?: SortOrder
    recommended?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ResumeAnalysisSumOrderByAggregateInput = {
    totalScore?: SortOrder
    skillScore?: SortOrder
    experienceScore?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type ApplicationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    jobId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type ApplicationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    jobId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type ApplicationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    jobId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type NFTProofCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    nftType?: SortOrder
    tokenId?: SortOrder
    txHash?: SortOrder
    mintedAt?: SortOrder
  }

  export type NFTProofMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    nftType?: SortOrder
    tokenId?: SortOrder
    txHash?: SortOrder
    mintedAt?: SortOrder
  }

  export type NFTProofMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    nftType?: SortOrder
    tokenId?: SortOrder
    txHash?: SortOrder
    mintedAt?: SortOrder
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

  export type job_tag_relationTopic_idTag_idCompoundUniqueInput = {
    topic_id: string
    tag_id: bigint | number
  }

  export type job_tag_relationCountOrderByAggregateInput = {
    topic_id?: SortOrder
    tag_id?: SortOrder
    ffrom?: SortOrder
  }

  export type job_tag_relationAvgOrderByAggregateInput = {
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
    tag_id?: SortOrder
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

  export type job_user_relationTopic_idUser_idCompoundUniqueInput = {
    topic_id: string
    user_id: bigint | number
  }

  export type job_user_relationCountOrderByAggregateInput = {
    topic_id?: SortOrder
    user_id?: SortOrder
    ffrom?: SortOrder
  }

  export type job_user_relationAvgOrderByAggregateInput = {
    user_id?: SortOrder
  }

  export type job_user_relationMaxOrderByAggregateInput = {
    topic_id?: SortOrder
    user_id?: SortOrder
    ffrom?: SortOrder
  }

  export type job_user_relationMinOrderByAggregateInput = {
    topic_id?: SortOrder
    user_id?: SortOrder
    ffrom?: SortOrder
  }

  export type job_user_relationSumOrderByAggregateInput = {
    user_id?: SortOrder
  }

  export type ApplicationCreateNestedManyWithoutUserInput = {
    create?: XOR<ApplicationCreateWithoutUserInput, ApplicationUncheckedCreateWithoutUserInput> | ApplicationCreateWithoutUserInput[] | ApplicationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutUserInput | ApplicationCreateOrConnectWithoutUserInput[]
    createMany?: ApplicationCreateManyUserInputEnvelope
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
  }

  export type NFTProofCreateNestedManyWithoutUserInput = {
    create?: XOR<NFTProofCreateWithoutUserInput, NFTProofUncheckedCreateWithoutUserInput> | NFTProofCreateWithoutUserInput[] | NFTProofUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NFTProofCreateOrConnectWithoutUserInput | NFTProofCreateOrConnectWithoutUserInput[]
    createMany?: NFTProofCreateManyUserInputEnvelope
    connect?: NFTProofWhereUniqueInput | NFTProofWhereUniqueInput[]
  }

  export type ApplicationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ApplicationCreateWithoutUserInput, ApplicationUncheckedCreateWithoutUserInput> | ApplicationCreateWithoutUserInput[] | ApplicationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutUserInput | ApplicationCreateOrConnectWithoutUserInput[]
    createMany?: ApplicationCreateManyUserInputEnvelope
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
  }

  export type NFTProofUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<NFTProofCreateWithoutUserInput, NFTProofUncheckedCreateWithoutUserInput> | NFTProofCreateWithoutUserInput[] | NFTProofUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NFTProofCreateOrConnectWithoutUserInput | NFTProofCreateOrConnectWithoutUserInput[]
    createMany?: NFTProofCreateManyUserInputEnvelope
    connect?: NFTProofWhereUniqueInput | NFTProofWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ApplicationUpdateManyWithoutUserNestedInput = {
    create?: XOR<ApplicationCreateWithoutUserInput, ApplicationUncheckedCreateWithoutUserInput> | ApplicationCreateWithoutUserInput[] | ApplicationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutUserInput | ApplicationCreateOrConnectWithoutUserInput[]
    upsert?: ApplicationUpsertWithWhereUniqueWithoutUserInput | ApplicationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ApplicationCreateManyUserInputEnvelope
    set?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    disconnect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    delete?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    update?: ApplicationUpdateWithWhereUniqueWithoutUserInput | ApplicationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ApplicationUpdateManyWithWhereWithoutUserInput | ApplicationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
  }

  export type NFTProofUpdateManyWithoutUserNestedInput = {
    create?: XOR<NFTProofCreateWithoutUserInput, NFTProofUncheckedCreateWithoutUserInput> | NFTProofCreateWithoutUserInput[] | NFTProofUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NFTProofCreateOrConnectWithoutUserInput | NFTProofCreateOrConnectWithoutUserInput[]
    upsert?: NFTProofUpsertWithWhereUniqueWithoutUserInput | NFTProofUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NFTProofCreateManyUserInputEnvelope
    set?: NFTProofWhereUniqueInput | NFTProofWhereUniqueInput[]
    disconnect?: NFTProofWhereUniqueInput | NFTProofWhereUniqueInput[]
    delete?: NFTProofWhereUniqueInput | NFTProofWhereUniqueInput[]
    connect?: NFTProofWhereUniqueInput | NFTProofWhereUniqueInput[]
    update?: NFTProofUpdateWithWhereUniqueWithoutUserInput | NFTProofUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NFTProofUpdateManyWithWhereWithoutUserInput | NFTProofUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NFTProofScalarWhereInput | NFTProofScalarWhereInput[]
  }

  export type ApplicationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ApplicationCreateWithoutUserInput, ApplicationUncheckedCreateWithoutUserInput> | ApplicationCreateWithoutUserInput[] | ApplicationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutUserInput | ApplicationCreateOrConnectWithoutUserInput[]
    upsert?: ApplicationUpsertWithWhereUniqueWithoutUserInput | ApplicationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ApplicationCreateManyUserInputEnvelope
    set?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    disconnect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    delete?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    update?: ApplicationUpdateWithWhereUniqueWithoutUserInput | ApplicationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ApplicationUpdateManyWithWhereWithoutUserInput | ApplicationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
  }

  export type NFTProofUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<NFTProofCreateWithoutUserInput, NFTProofUncheckedCreateWithoutUserInput> | NFTProofCreateWithoutUserInput[] | NFTProofUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NFTProofCreateOrConnectWithoutUserInput | NFTProofCreateOrConnectWithoutUserInput[]
    upsert?: NFTProofUpsertWithWhereUniqueWithoutUserInput | NFTProofUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NFTProofCreateManyUserInputEnvelope
    set?: NFTProofWhereUniqueInput | NFTProofWhereUniqueInput[]
    disconnect?: NFTProofWhereUniqueInput | NFTProofWhereUniqueInput[]
    delete?: NFTProofWhereUniqueInput | NFTProofWhereUniqueInput[]
    connect?: NFTProofWhereUniqueInput | NFTProofWhereUniqueInput[]
    update?: NFTProofUpdateWithWhereUniqueWithoutUserInput | NFTProofUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NFTProofUpdateManyWithWhereWithoutUserInput | NFTProofUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NFTProofScalarWhereInput | NFTProofScalarWhereInput[]
  }

  export type ApplicationCreateNestedManyWithoutJobInput = {
    create?: XOR<ApplicationCreateWithoutJobInput, ApplicationUncheckedCreateWithoutJobInput> | ApplicationCreateWithoutJobInput[] | ApplicationUncheckedCreateWithoutJobInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutJobInput | ApplicationCreateOrConnectWithoutJobInput[]
    createMany?: ApplicationCreateManyJobInputEnvelope
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
  }

  export type ResumeAnalysisCreateNestedManyWithoutJobInput = {
    create?: XOR<ResumeAnalysisCreateWithoutJobInput, ResumeAnalysisUncheckedCreateWithoutJobInput> | ResumeAnalysisCreateWithoutJobInput[] | ResumeAnalysisUncheckedCreateWithoutJobInput[]
    connectOrCreate?: ResumeAnalysisCreateOrConnectWithoutJobInput | ResumeAnalysisCreateOrConnectWithoutJobInput[]
    createMany?: ResumeAnalysisCreateManyJobInputEnvelope
    connect?: ResumeAnalysisWhereUniqueInput | ResumeAnalysisWhereUniqueInput[]
  }

  export type ApplicationUncheckedCreateNestedManyWithoutJobInput = {
    create?: XOR<ApplicationCreateWithoutJobInput, ApplicationUncheckedCreateWithoutJobInput> | ApplicationCreateWithoutJobInput[] | ApplicationUncheckedCreateWithoutJobInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutJobInput | ApplicationCreateOrConnectWithoutJobInput[]
    createMany?: ApplicationCreateManyJobInputEnvelope
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
  }

  export type ResumeAnalysisUncheckedCreateNestedManyWithoutJobInput = {
    create?: XOR<ResumeAnalysisCreateWithoutJobInput, ResumeAnalysisUncheckedCreateWithoutJobInput> | ResumeAnalysisCreateWithoutJobInput[] | ResumeAnalysisUncheckedCreateWithoutJobInput[]
    connectOrCreate?: ResumeAnalysisCreateOrConnectWithoutJobInput | ResumeAnalysisCreateOrConnectWithoutJobInput[]
    createMany?: ResumeAnalysisCreateManyJobInputEnvelope
    connect?: ResumeAnalysisWhereUniqueInput | ResumeAnalysisWhereUniqueInput[]
  }

  export type ApplicationUpdateManyWithoutJobNestedInput = {
    create?: XOR<ApplicationCreateWithoutJobInput, ApplicationUncheckedCreateWithoutJobInput> | ApplicationCreateWithoutJobInput[] | ApplicationUncheckedCreateWithoutJobInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutJobInput | ApplicationCreateOrConnectWithoutJobInput[]
    upsert?: ApplicationUpsertWithWhereUniqueWithoutJobInput | ApplicationUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: ApplicationCreateManyJobInputEnvelope
    set?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    disconnect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    delete?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    update?: ApplicationUpdateWithWhereUniqueWithoutJobInput | ApplicationUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: ApplicationUpdateManyWithWhereWithoutJobInput | ApplicationUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
  }

  export type ResumeAnalysisUpdateManyWithoutJobNestedInput = {
    create?: XOR<ResumeAnalysisCreateWithoutJobInput, ResumeAnalysisUncheckedCreateWithoutJobInput> | ResumeAnalysisCreateWithoutJobInput[] | ResumeAnalysisUncheckedCreateWithoutJobInput[]
    connectOrCreate?: ResumeAnalysisCreateOrConnectWithoutJobInput | ResumeAnalysisCreateOrConnectWithoutJobInput[]
    upsert?: ResumeAnalysisUpsertWithWhereUniqueWithoutJobInput | ResumeAnalysisUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: ResumeAnalysisCreateManyJobInputEnvelope
    set?: ResumeAnalysisWhereUniqueInput | ResumeAnalysisWhereUniqueInput[]
    disconnect?: ResumeAnalysisWhereUniqueInput | ResumeAnalysisWhereUniqueInput[]
    delete?: ResumeAnalysisWhereUniqueInput | ResumeAnalysisWhereUniqueInput[]
    connect?: ResumeAnalysisWhereUniqueInput | ResumeAnalysisWhereUniqueInput[]
    update?: ResumeAnalysisUpdateWithWhereUniqueWithoutJobInput | ResumeAnalysisUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: ResumeAnalysisUpdateManyWithWhereWithoutJobInput | ResumeAnalysisUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: ResumeAnalysisScalarWhereInput | ResumeAnalysisScalarWhereInput[]
  }

  export type ApplicationUncheckedUpdateManyWithoutJobNestedInput = {
    create?: XOR<ApplicationCreateWithoutJobInput, ApplicationUncheckedCreateWithoutJobInput> | ApplicationCreateWithoutJobInput[] | ApplicationUncheckedCreateWithoutJobInput[]
    connectOrCreate?: ApplicationCreateOrConnectWithoutJobInput | ApplicationCreateOrConnectWithoutJobInput[]
    upsert?: ApplicationUpsertWithWhereUniqueWithoutJobInput | ApplicationUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: ApplicationCreateManyJobInputEnvelope
    set?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    disconnect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    delete?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    connect?: ApplicationWhereUniqueInput | ApplicationWhereUniqueInput[]
    update?: ApplicationUpdateWithWhereUniqueWithoutJobInput | ApplicationUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: ApplicationUpdateManyWithWhereWithoutJobInput | ApplicationUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
  }

  export type ResumeAnalysisUncheckedUpdateManyWithoutJobNestedInput = {
    create?: XOR<ResumeAnalysisCreateWithoutJobInput, ResumeAnalysisUncheckedCreateWithoutJobInput> | ResumeAnalysisCreateWithoutJobInput[] | ResumeAnalysisUncheckedCreateWithoutJobInput[]
    connectOrCreate?: ResumeAnalysisCreateOrConnectWithoutJobInput | ResumeAnalysisCreateOrConnectWithoutJobInput[]
    upsert?: ResumeAnalysisUpsertWithWhereUniqueWithoutJobInput | ResumeAnalysisUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: ResumeAnalysisCreateManyJobInputEnvelope
    set?: ResumeAnalysisWhereUniqueInput | ResumeAnalysisWhereUniqueInput[]
    disconnect?: ResumeAnalysisWhereUniqueInput | ResumeAnalysisWhereUniqueInput[]
    delete?: ResumeAnalysisWhereUniqueInput | ResumeAnalysisWhereUniqueInput[]
    connect?: ResumeAnalysisWhereUniqueInput | ResumeAnalysisWhereUniqueInput[]
    update?: ResumeAnalysisUpdateWithWhereUniqueWithoutJobInput | ResumeAnalysisUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: ResumeAnalysisUpdateManyWithWhereWithoutJobInput | ResumeAnalysisUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: ResumeAnalysisScalarWhereInput | ResumeAnalysisScalarWhereInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type JobCreateNestedOneWithoutResumeAnalysesInput = {
    create?: XOR<JobCreateWithoutResumeAnalysesInput, JobUncheckedCreateWithoutResumeAnalysesInput>
    connectOrCreate?: JobCreateOrConnectWithoutResumeAnalysesInput
    connect?: JobWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type JobUpdateOneRequiredWithoutResumeAnalysesNestedInput = {
    create?: XOR<JobCreateWithoutResumeAnalysesInput, JobUncheckedCreateWithoutResumeAnalysesInput>
    connectOrCreate?: JobCreateOrConnectWithoutResumeAnalysesInput
    upsert?: JobUpsertWithoutResumeAnalysesInput
    connect?: JobWhereUniqueInput
    update?: XOR<XOR<JobUpdateToOneWithWhereWithoutResumeAnalysesInput, JobUpdateWithoutResumeAnalysesInput>, JobUncheckedUpdateWithoutResumeAnalysesInput>
  }

  export type JobCreateNestedOneWithoutApplicationsInput = {
    create?: XOR<JobCreateWithoutApplicationsInput, JobUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: JobCreateOrConnectWithoutApplicationsInput
    connect?: JobWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutApplicationsInput = {
    create?: XOR<UserCreateWithoutApplicationsInput, UserUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutApplicationsInput
    connect?: UserWhereUniqueInput
  }

  export type JobUpdateOneRequiredWithoutApplicationsNestedInput = {
    create?: XOR<JobCreateWithoutApplicationsInput, JobUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: JobCreateOrConnectWithoutApplicationsInput
    upsert?: JobUpsertWithoutApplicationsInput
    connect?: JobWhereUniqueInput
    update?: XOR<XOR<JobUpdateToOneWithWhereWithoutApplicationsInput, JobUpdateWithoutApplicationsInput>, JobUncheckedUpdateWithoutApplicationsInput>
  }

  export type UserUpdateOneRequiredWithoutApplicationsNestedInput = {
    create?: XOR<UserCreateWithoutApplicationsInput, UserUncheckedCreateWithoutApplicationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutApplicationsInput
    upsert?: UserUpsertWithoutApplicationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutApplicationsInput, UserUpdateWithoutApplicationsInput>, UserUncheckedUpdateWithoutApplicationsInput>
  }

  export type UserCreateNestedOneWithoutNftProofsInput = {
    create?: XOR<UserCreateWithoutNftProofsInput, UserUncheckedCreateWithoutNftProofsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNftProofsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutNftProofsNestedInput = {
    create?: XOR<UserCreateWithoutNftProofsInput, UserUncheckedCreateWithoutNftProofsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNftProofsInput
    upsert?: UserUpsertWithoutNftProofsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutNftProofsInput, UserUpdateWithoutNftProofsInput>, UserUncheckedUpdateWithoutNftProofsInput>
  }

  export type NullableBigIntFieldUpdateOperationsInput = {
    set?: bigint | number | null
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
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

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
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

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
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

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
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

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type ApplicationCreateWithoutUserInput = {
    id?: string
    status: string
    createdAt?: Date | string
    job: JobCreateNestedOneWithoutApplicationsInput
  }

  export type ApplicationUncheckedCreateWithoutUserInput = {
    id?: string
    jobId: string
    status: string
    createdAt?: Date | string
  }

  export type ApplicationCreateOrConnectWithoutUserInput = {
    where: ApplicationWhereUniqueInput
    create: XOR<ApplicationCreateWithoutUserInput, ApplicationUncheckedCreateWithoutUserInput>
  }

  export type ApplicationCreateManyUserInputEnvelope = {
    data: ApplicationCreateManyUserInput | ApplicationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type NFTProofCreateWithoutUserInput = {
    id?: string
    nftType: string
    tokenId: string
    txHash: string
    mintedAt: Date | string
  }

  export type NFTProofUncheckedCreateWithoutUserInput = {
    id?: string
    nftType: string
    tokenId: string
    txHash: string
    mintedAt: Date | string
  }

  export type NFTProofCreateOrConnectWithoutUserInput = {
    where: NFTProofWhereUniqueInput
    create: XOR<NFTProofCreateWithoutUserInput, NFTProofUncheckedCreateWithoutUserInput>
  }

  export type NFTProofCreateManyUserInputEnvelope = {
    data: NFTProofCreateManyUserInput | NFTProofCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ApplicationUpsertWithWhereUniqueWithoutUserInput = {
    where: ApplicationWhereUniqueInput
    update: XOR<ApplicationUpdateWithoutUserInput, ApplicationUncheckedUpdateWithoutUserInput>
    create: XOR<ApplicationCreateWithoutUserInput, ApplicationUncheckedCreateWithoutUserInput>
  }

  export type ApplicationUpdateWithWhereUniqueWithoutUserInput = {
    where: ApplicationWhereUniqueInput
    data: XOR<ApplicationUpdateWithoutUserInput, ApplicationUncheckedUpdateWithoutUserInput>
  }

  export type ApplicationUpdateManyWithWhereWithoutUserInput = {
    where: ApplicationScalarWhereInput
    data: XOR<ApplicationUpdateManyMutationInput, ApplicationUncheckedUpdateManyWithoutUserInput>
  }

  export type ApplicationScalarWhereInput = {
    AND?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
    OR?: ApplicationScalarWhereInput[]
    NOT?: ApplicationScalarWhereInput | ApplicationScalarWhereInput[]
    id?: StringFilter<"Application"> | string
    userId?: StringFilter<"Application"> | string
    jobId?: StringFilter<"Application"> | string
    status?: StringFilter<"Application"> | string
    createdAt?: DateTimeFilter<"Application"> | Date | string
  }

  export type NFTProofUpsertWithWhereUniqueWithoutUserInput = {
    where: NFTProofWhereUniqueInput
    update: XOR<NFTProofUpdateWithoutUserInput, NFTProofUncheckedUpdateWithoutUserInput>
    create: XOR<NFTProofCreateWithoutUserInput, NFTProofUncheckedCreateWithoutUserInput>
  }

  export type NFTProofUpdateWithWhereUniqueWithoutUserInput = {
    where: NFTProofWhereUniqueInput
    data: XOR<NFTProofUpdateWithoutUserInput, NFTProofUncheckedUpdateWithoutUserInput>
  }

  export type NFTProofUpdateManyWithWhereWithoutUserInput = {
    where: NFTProofScalarWhereInput
    data: XOR<NFTProofUpdateManyMutationInput, NFTProofUncheckedUpdateManyWithoutUserInput>
  }

  export type NFTProofScalarWhereInput = {
    AND?: NFTProofScalarWhereInput | NFTProofScalarWhereInput[]
    OR?: NFTProofScalarWhereInput[]
    NOT?: NFTProofScalarWhereInput | NFTProofScalarWhereInput[]
    id?: StringFilter<"NFTProof"> | string
    userId?: StringFilter<"NFTProof"> | string
    nftType?: StringFilter<"NFTProof"> | string
    tokenId?: StringFilter<"NFTProof"> | string
    txHash?: StringFilter<"NFTProof"> | string
    mintedAt?: DateTimeFilter<"NFTProof"> | Date | string
  }

  export type ApplicationCreateWithoutJobInput = {
    id?: string
    status: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutApplicationsInput
  }

  export type ApplicationUncheckedCreateWithoutJobInput = {
    id?: string
    userId: string
    status: string
    createdAt?: Date | string
  }

  export type ApplicationCreateOrConnectWithoutJobInput = {
    where: ApplicationWhereUniqueInput
    create: XOR<ApplicationCreateWithoutJobInput, ApplicationUncheckedCreateWithoutJobInput>
  }

  export type ApplicationCreateManyJobInputEnvelope = {
    data: ApplicationCreateManyJobInput | ApplicationCreateManyJobInput[]
    skipDuplicates?: boolean
  }

  export type ResumeAnalysisCreateWithoutJobInput = {
    id?: string
    resumeContent: string
    parsedResume: JsonNullValueInput | InputJsonValue
    totalScore: number
    skillScore: number
    experienceScore: number
    matchingPoints: JsonNullValueInput | InputJsonValue
    suggestions: JsonNullValueInput | InputJsonValue
    recommended: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ResumeAnalysisUncheckedCreateWithoutJobInput = {
    id?: string
    resumeContent: string
    parsedResume: JsonNullValueInput | InputJsonValue
    totalScore: number
    skillScore: number
    experienceScore: number
    matchingPoints: JsonNullValueInput | InputJsonValue
    suggestions: JsonNullValueInput | InputJsonValue
    recommended: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ResumeAnalysisCreateOrConnectWithoutJobInput = {
    where: ResumeAnalysisWhereUniqueInput
    create: XOR<ResumeAnalysisCreateWithoutJobInput, ResumeAnalysisUncheckedCreateWithoutJobInput>
  }

  export type ResumeAnalysisCreateManyJobInputEnvelope = {
    data: ResumeAnalysisCreateManyJobInput | ResumeAnalysisCreateManyJobInput[]
    skipDuplicates?: boolean
  }

  export type ApplicationUpsertWithWhereUniqueWithoutJobInput = {
    where: ApplicationWhereUniqueInput
    update: XOR<ApplicationUpdateWithoutJobInput, ApplicationUncheckedUpdateWithoutJobInput>
    create: XOR<ApplicationCreateWithoutJobInput, ApplicationUncheckedCreateWithoutJobInput>
  }

  export type ApplicationUpdateWithWhereUniqueWithoutJobInput = {
    where: ApplicationWhereUniqueInput
    data: XOR<ApplicationUpdateWithoutJobInput, ApplicationUncheckedUpdateWithoutJobInput>
  }

  export type ApplicationUpdateManyWithWhereWithoutJobInput = {
    where: ApplicationScalarWhereInput
    data: XOR<ApplicationUpdateManyMutationInput, ApplicationUncheckedUpdateManyWithoutJobInput>
  }

  export type ResumeAnalysisUpsertWithWhereUniqueWithoutJobInput = {
    where: ResumeAnalysisWhereUniqueInput
    update: XOR<ResumeAnalysisUpdateWithoutJobInput, ResumeAnalysisUncheckedUpdateWithoutJobInput>
    create: XOR<ResumeAnalysisCreateWithoutJobInput, ResumeAnalysisUncheckedCreateWithoutJobInput>
  }

  export type ResumeAnalysisUpdateWithWhereUniqueWithoutJobInput = {
    where: ResumeAnalysisWhereUniqueInput
    data: XOR<ResumeAnalysisUpdateWithoutJobInput, ResumeAnalysisUncheckedUpdateWithoutJobInput>
  }

  export type ResumeAnalysisUpdateManyWithWhereWithoutJobInput = {
    where: ResumeAnalysisScalarWhereInput
    data: XOR<ResumeAnalysisUpdateManyMutationInput, ResumeAnalysisUncheckedUpdateManyWithoutJobInput>
  }

  export type ResumeAnalysisScalarWhereInput = {
    AND?: ResumeAnalysisScalarWhereInput | ResumeAnalysisScalarWhereInput[]
    OR?: ResumeAnalysisScalarWhereInput[]
    NOT?: ResumeAnalysisScalarWhereInput | ResumeAnalysisScalarWhereInput[]
    id?: StringFilter<"ResumeAnalysis"> | string
    jobId?: StringFilter<"ResumeAnalysis"> | string
    resumeContent?: StringFilter<"ResumeAnalysis"> | string
    parsedResume?: JsonFilter<"ResumeAnalysis">
    totalScore?: FloatFilter<"ResumeAnalysis"> | number
    skillScore?: FloatFilter<"ResumeAnalysis"> | number
    experienceScore?: FloatFilter<"ResumeAnalysis"> | number
    matchingPoints?: JsonFilter<"ResumeAnalysis">
    suggestions?: JsonFilter<"ResumeAnalysis">
    recommended?: BoolFilter<"ResumeAnalysis"> | boolean
    createdAt?: DateTimeFilter<"ResumeAnalysis"> | Date | string
    updatedAt?: DateTimeFilter<"ResumeAnalysis"> | Date | string
  }

  export type JobCreateWithoutResumeAnalysesInput = {
    id?: string
    title: string
    description: string
    jobType: string
    weights: JsonNullValueInput | InputJsonValue
    parsedRequirements: JsonNullValueInput | InputJsonValue
    vectorMetadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationCreateNestedManyWithoutJobInput
  }

  export type JobUncheckedCreateWithoutResumeAnalysesInput = {
    id?: string
    title: string
    description: string
    jobType: string
    weights: JsonNullValueInput | InputJsonValue
    parsedRequirements: JsonNullValueInput | InputJsonValue
    vectorMetadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationUncheckedCreateNestedManyWithoutJobInput
  }

  export type JobCreateOrConnectWithoutResumeAnalysesInput = {
    where: JobWhereUniqueInput
    create: XOR<JobCreateWithoutResumeAnalysesInput, JobUncheckedCreateWithoutResumeAnalysesInput>
  }

  export type JobUpsertWithoutResumeAnalysesInput = {
    update: XOR<JobUpdateWithoutResumeAnalysesInput, JobUncheckedUpdateWithoutResumeAnalysesInput>
    create: XOR<JobCreateWithoutResumeAnalysesInput, JobUncheckedCreateWithoutResumeAnalysesInput>
    where?: JobWhereInput
  }

  export type JobUpdateToOneWithWhereWithoutResumeAnalysesInput = {
    where?: JobWhereInput
    data: XOR<JobUpdateWithoutResumeAnalysesInput, JobUncheckedUpdateWithoutResumeAnalysesInput>
  }

  export type JobUpdateWithoutResumeAnalysesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    jobType?: StringFieldUpdateOperationsInput | string
    weights?: JsonNullValueInput | InputJsonValue
    parsedRequirements?: JsonNullValueInput | InputJsonValue
    vectorMetadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateWithoutResumeAnalysesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    jobType?: StringFieldUpdateOperationsInput | string
    weights?: JsonNullValueInput | InputJsonValue
    parsedRequirements?: JsonNullValueInput | InputJsonValue
    vectorMetadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUncheckedUpdateManyWithoutJobNestedInput
  }

  export type JobCreateWithoutApplicationsInput = {
    id?: string
    title: string
    description: string
    jobType: string
    weights: JsonNullValueInput | InputJsonValue
    parsedRequirements: JsonNullValueInput | InputJsonValue
    vectorMetadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    resumeAnalyses?: ResumeAnalysisCreateNestedManyWithoutJobInput
  }

  export type JobUncheckedCreateWithoutApplicationsInput = {
    id?: string
    title: string
    description: string
    jobType: string
    weights: JsonNullValueInput | InputJsonValue
    parsedRequirements: JsonNullValueInput | InputJsonValue
    vectorMetadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    resumeAnalyses?: ResumeAnalysisUncheckedCreateNestedManyWithoutJobInput
  }

  export type JobCreateOrConnectWithoutApplicationsInput = {
    where: JobWhereUniqueInput
    create: XOR<JobCreateWithoutApplicationsInput, JobUncheckedCreateWithoutApplicationsInput>
  }

  export type UserCreateWithoutApplicationsInput = {
    id?: string
    address: string
    nickname?: string | null
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    nftProofs?: NFTProofCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutApplicationsInput = {
    id?: string
    address: string
    nickname?: string | null
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    nftProofs?: NFTProofUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutApplicationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutApplicationsInput, UserUncheckedCreateWithoutApplicationsInput>
  }

  export type JobUpsertWithoutApplicationsInput = {
    update: XOR<JobUpdateWithoutApplicationsInput, JobUncheckedUpdateWithoutApplicationsInput>
    create: XOR<JobCreateWithoutApplicationsInput, JobUncheckedCreateWithoutApplicationsInput>
    where?: JobWhereInput
  }

  export type JobUpdateToOneWithWhereWithoutApplicationsInput = {
    where?: JobWhereInput
    data: XOR<JobUpdateWithoutApplicationsInput, JobUncheckedUpdateWithoutApplicationsInput>
  }

  export type JobUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    jobType?: StringFieldUpdateOperationsInput | string
    weights?: JsonNullValueInput | InputJsonValue
    parsedRequirements?: JsonNullValueInput | InputJsonValue
    vectorMetadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resumeAnalyses?: ResumeAnalysisUpdateManyWithoutJobNestedInput
  }

  export type JobUncheckedUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    jobType?: StringFieldUpdateOperationsInput | string
    weights?: JsonNullValueInput | InputJsonValue
    parsedRequirements?: JsonNullValueInput | InputJsonValue
    vectorMetadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resumeAnalyses?: ResumeAnalysisUncheckedUpdateManyWithoutJobNestedInput
  }

  export type UserUpsertWithoutApplicationsInput = {
    update: XOR<UserUpdateWithoutApplicationsInput, UserUncheckedUpdateWithoutApplicationsInput>
    create: XOR<UserCreateWithoutApplicationsInput, UserUncheckedCreateWithoutApplicationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutApplicationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutApplicationsInput, UserUncheckedUpdateWithoutApplicationsInput>
  }

  export type UserUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nftProofs?: NFTProofUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutApplicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nftProofs?: NFTProofUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutNftProofsInput = {
    id?: string
    address: string
    nickname?: string | null
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutNftProofsInput = {
    id?: string
    address: string
    nickname?: string | null
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    applications?: ApplicationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutNftProofsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutNftProofsInput, UserUncheckedCreateWithoutNftProofsInput>
  }

  export type UserUpsertWithoutNftProofsInput = {
    update: XOR<UserUpdateWithoutNftProofsInput, UserUncheckedUpdateWithoutNftProofsInput>
    create: XOR<UserCreateWithoutNftProofsInput, UserUncheckedCreateWithoutNftProofsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutNftProofsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutNftProofsInput, UserUncheckedUpdateWithoutNftProofsInput>
  }

  export type UserUpdateWithoutNftProofsInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutNftProofsInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    applications?: ApplicationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ApplicationCreateManyUserInput = {
    id?: string
    jobId: string
    status: string
    createdAt?: Date | string
  }

  export type NFTProofCreateManyUserInput = {
    id?: string
    nftType: string
    tokenId: string
    txHash: string
    mintedAt: Date | string
  }

  export type ApplicationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    job?: JobUpdateOneRequiredWithoutApplicationsNestedInput
  }

  export type ApplicationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NFTProofUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    nftType?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    mintedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NFTProofUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    nftType?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    mintedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NFTProofUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    nftType?: StringFieldUpdateOperationsInput | string
    tokenId?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    mintedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationCreateManyJobInput = {
    id?: string
    userId: string
    status: string
    createdAt?: Date | string
  }

  export type ResumeAnalysisCreateManyJobInput = {
    id?: string
    resumeContent: string
    parsedResume: JsonNullValueInput | InputJsonValue
    totalScore: number
    skillScore: number
    experienceScore: number
    matchingPoints: JsonNullValueInput | InputJsonValue
    suggestions: JsonNullValueInput | InputJsonValue
    recommended: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ApplicationUpdateWithoutJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutApplicationsNestedInput
  }

  export type ApplicationUncheckedUpdateWithoutJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationUncheckedUpdateManyWithoutJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResumeAnalysisUpdateWithoutJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    resumeContent?: StringFieldUpdateOperationsInput | string
    parsedResume?: JsonNullValueInput | InputJsonValue
    totalScore?: FloatFieldUpdateOperationsInput | number
    skillScore?: FloatFieldUpdateOperationsInput | number
    experienceScore?: FloatFieldUpdateOperationsInput | number
    matchingPoints?: JsonNullValueInput | InputJsonValue
    suggestions?: JsonNullValueInput | InputJsonValue
    recommended?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResumeAnalysisUncheckedUpdateWithoutJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    resumeContent?: StringFieldUpdateOperationsInput | string
    parsedResume?: JsonNullValueInput | InputJsonValue
    totalScore?: FloatFieldUpdateOperationsInput | number
    skillScore?: FloatFieldUpdateOperationsInput | number
    experienceScore?: FloatFieldUpdateOperationsInput | number
    matchingPoints?: JsonNullValueInput | InputJsonValue
    suggestions?: JsonNullValueInput | InputJsonValue
    recommended?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResumeAnalysisUncheckedUpdateManyWithoutJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    resumeContent?: StringFieldUpdateOperationsInput | string
    parsedResume?: JsonNullValueInput | InputJsonValue
    totalScore?: FloatFieldUpdateOperationsInput | number
    skillScore?: FloatFieldUpdateOperationsInput | number
    experienceScore?: FloatFieldUpdateOperationsInput | number
    matchingPoints?: JsonNullValueInput | InputJsonValue
    suggestions?: JsonNullValueInput | InputJsonValue
    recommended?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use JobCountOutputTypeDefaultArgs instead
     */
    export type JobCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = JobCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use JobDefaultArgs instead
     */
    export type JobArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = JobDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ResumeDefaultArgs instead
     */
    export type ResumeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ResumeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ResumeAnalysisDefaultArgs instead
     */
    export type ResumeAnalysisArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ResumeAnalysisDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ApplicationDefaultArgs instead
     */
    export type ApplicationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ApplicationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NFTProofDefaultArgs instead
     */
    export type NFTProofArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NFTProofDefaultArgs<ExtArgs>
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
     * @deprecated Use job_user_relationDefaultArgs instead
     */
    export type job_user_relationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = job_user_relationDefaultArgs<ExtArgs>

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