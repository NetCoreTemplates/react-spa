export type Author = {
    name: string
    picture: string
}
export type Post = {
    slug: string
    title: string
    date: string
    coverImage: string
    author: Author
    excerpt: string
    ogImage: {
        url: string
    }
    content: string
}

export type FormStyle = "slideOver" | "card"
export type TableStyle = "simple" | "fullWidth" | "stripedRows" | "whiteBackground" | "uppercaseHeadings" | "verticalLines"
export type TableStyleOptions = TableStyle|TableStyle[]|string
export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

/* AutoQueryGrid */
export type GridAllowOptions = "filtering" | "queryString" | "queryFilters"
export type GridShowOptions = "toolbar" | "preferences" | "pagingNav" | "pagingInfo" | "downloadCsv" | "refresh" | "copyApiUrl" 
    | "resetPreferences" | "filtersView" | "newItem"
/* MarkdownInput */
export type MarkdownInputOptions = "bold" | "italics" | "link" | "image" | "blockquote" | "code" | "heading" | "orderedList"
    | "unorderedList" | "strikethrough" | "undo" | "redo" | "help"

export type ApiPrefs = {
    take?: number
    selectedColumns?: string[]    
}
export type ColumnSettings = {
    filters:Filter[]
    sort?:"ASC" | "DESC"
}
export type Filter = {
    key: string
    name: string
    value: string
    values?: string[]
}
export type Column = {
    name: string
    type: string
    meta: MetadataPropertyType
    settings: ColumnSettings
    fieldName?: string
    headerClass?: string
    cellClass?: string
    title?: string
    format?: string
    visibleFrom?:Breakpoint
}
export type AutoQueryGridDefaults = {
    deny?:GridAllowOptions[]
    hide?:GridShowOptions[]
    toolbarButtonClass?: string
    tableStyle?: TableStyleOptions
    take?:number
    maxFieldLength?: number
}
export type ModalProvider = {
    openModal: (info:{name:string} & any, done:(result:any) => any) => void
}

export interface IResponseError {
    errorCode?: string;
    fieldName?: string;
    message?: string;
}

export interface IResponseStatus extends IResponseError {
    errors?: ResponseError[];
}

export type ApiState = {
    unRefs: (o:any) => any
    // setRef: ($ref:Ref<any>, $item:any) => void
    setError: ({ message, errorCode, fieldName, errors }: IResponseStatus) => ResponseStatus
    addFieldError: ({ fieldName, message, errorCode }: IResponseError) => void
    // loading: Ref<boolean>
    // error: Ref<any>
    api: <TResponse>(request: IReturn<TResponse> | ApiRequest, args?: any, method?: string) => Promise<ApiResult<TResponse>>
    apiVoid: (request: IReturnVoid | ApiRequest, args?: any, method?: string) => Promise<ApiResult<EmptyResponse>>
    apiForm: <TResponse>(request: ApiRequest | IReturn<TResponse>, body: FormData, args?: any, method?: string) => Promise<ApiResult<TResponse>>
    apiFormVoid: (request: IReturnVoid | ApiRequest, body: FormData, args?: any, method?: string) => Promise<ApiResult<EmptyResponse>>
    swr: <TResponse>(request:IReturn<TResponse> | ApiRequest, fn:(r:ApiResult<TResponse>) => void, args?: any, method?: string) => Promise<ApiResult<TResponse>>
}

export type TransitionRule = {
    cls: string
    from: string
    to: string
}
export type TransitionRules = {
    entering: TransitionRule
    leaving: TransitionRule
}

export type AuthenticateResponse = {
    userId?: string
    sessionId?: string
    userName?: string
    displayName?: string
    referrerUrl?: string
    bearerToken?: string
    refreshToken?: string
    profileUrl?: string
    roles?: string[]
    permissions?: string[]
}

export interface UiConfig {
    redirectSignIn?: string
    redirectSignOut?: string
    navigate?: (url:string) => void
    assetsPathResolver?: (src:string) => string
    fallbackPathResolver?: (src:string) => string
    autoQueryGridDefaults?: AutoQueryGridDefaults
    storage?:Storage
    tableIcon?:ImageInfo
    scopeWhitelist?: {[k:string]:Function}
}

export interface UploadedFile {
    fileName?: string
    filePath?: string
    contentType?: string
    contentLength?: number
}

export interface InputProp extends InputInfo {
    prop?: MetadataPropertyType
    op?: MetadataOperationType
}

/* Core Types */
export interface ApiResponseType {
    response?: any;
    error?: ResponseStatus;
}
export interface ApiResponse {
    response?: any;
    error?: ResponseStatus;
    get completed(): boolean;
    get failed(): boolean;
    get succeeded(): boolean;
    get errorMessage(): string;
    get errorCode(): string;
    get errors(): ResponseError[];
    get errorSummary(): string;
}
export interface ApiResult<TResponse> extends ApiResponse {
    response?: TResponse;
    error?: ResponseStatus;
    get completed(): boolean;
    get failed(): boolean;
    get succeeded(): boolean;
    get errorMessage(): string;
    get errorCode(): string;
    get errors(): ResponseError[];
    get errorSummary(): string;
    fieldError(fieldName: string): ResponseError;
    fieldErrorMessage(fieldName: string): string;
    hasFieldError(fieldName: string): boolean;
    showSummary(exceptFields?: string[]): boolean;
    summaryMessage(exceptFields?: string[]): string;
    addFieldError(fieldName: string, message: string, errorCode?: string): void;
}

export interface ApiRequest {
    [k:string]: any;
    getTypeName(): string;
    getMethod(): string;
    createResponse(): any;
}
export interface IReturnVoid {
    createResponse(): any;
}
export interface IReturn<T> {
    createResponse(): T;
}
export interface ResponseStatus {
    errorCode?: string;
    message?: string;
    stackTrace?: string;
    errors?: ResponseError[];
    meta?: {
        [index: string]: string;
    };
}
export interface ResponseError {
    errorCode?: string;
    fieldName?: string;
    message?: string;
    meta?: {
        [index: string]: string;
    };
}
export interface ErrorResponse {
    responseStatus?: ResponseStatus;
}
export interface EmptyResponse {
    responseStatus?: ResponseStatus;
}

/* AppMetadata */
export interface RedisEndpointInfo {
    host: string;
    port: number;
    ssl?: boolean;
    db: number;
    username: string;
    password: string;
}
export interface AppInfo {
    baseUrl: string;
    serviceStackVersion: string;
    serviceName: string;
    apiVersion: string;
    serviceDescription: string;
    serviceIconUrl: string;
    brandUrl: string;
    brandImageUrl: string;
    textColor: string;
    linkColor: string;
    backgroundColor: string;
    backgroundImageUrl: string;
    iconUrl: string;
    jsTextCase: string;
    meta: {
        [index: string]: string;
    };
}
export interface ImageInfo {
    svg?: string;
    uri?: string;
    alt?: string;
    cls?: string;
}
export interface LinkInfo {
    id: string;
    href: string;
    label: string;
    icon: ImageInfo;
    show: string;
    hide: string;
}
export interface ThemeInfo {
    form: string;
    modelIcon: ImageInfo;
}
export interface ApiCss {
    form: string;
    fieldset: string;
    field: string;
}
export interface AppTags {
    default: string;
    other: string;
}
export interface LocodeUi {
    css: ApiCss;
    tags: AppTags;
    maxFieldLength: number;
    maxNestedFields: number;
    maxNestedFieldLength: number;
}
export interface ExplorerUi {
    css: ApiCss;
    tags: AppTags;
}
export interface AdminUi {
    css: ApiCss;
}
export interface FormatInfo {
    method: string;
    options?: string;
    locale?: string;
}
export interface ApiFormat {
    locale?: string;
    assumeUtc?: boolean;
    number?: FormatInfo;
    date?: FormatInfo;
}
export interface UiInfo {
    brandIcon: ImageInfo;
    hideTags: string[];
    modules: string[];
    alwaysHideTags: string[];
    adminLinks: LinkInfo[];
    theme: ThemeInfo;
    locode: LocodeUi;
    explorer: ExplorerUi;
    admin: AdminUi;
    defaultFormats: ApiFormat;
    meta: {
        [index: string]: string;
    };
}
export interface ConfigInfo {
    debugMode?: boolean;
    meta: {
        [index: string]: string;
    };
}
export interface NavItem {
    label: string;
    href: string;
    exact?: boolean;
    id: string;
    className: string;
    iconClass: string;
    iconSrc: string;
    show: string;
    hide: string;
    children: NavItem[];
    meta: {
        [index: string]: string;
    };
}
export interface FieldCss {
    field: string;
    input: string;
    label: string;
}
export interface InputInfo {
    id: string;
    name?: string;
    type: string;
    value?: string;
    placeholder?: string;
    help?: string;
    label?: string;
    title?: string;
    size?: string;
    pattern?: string;
    readOnly?: boolean;
    required?: boolean;
    disabled?: boolean;
    autocomplete?: string;
    autofocus?: string;
    min?: string;
    max?: string;
    step?: number;
    minLength?: number;
    maxLength?: number;
    accept?: string;
    capture?: string;
    multiple?: boolean;
    allowableValues?: string[];
    allowableEntries?: KeyValuePair<string, string>[];
    options?: string;
    ignore?: boolean;
    css?: FieldCss;
    meta?: {
        [index: string]: string;
    };
}
export interface MetaAuthProvider {
    name: string;
    label: string;
    type: string;
    navItem: NavItem;
    icon: ImageInfo;
    formLayout: InputInfo[];
    meta: {
        [index: string]: string;
    };
}
export interface AuthInfo {
    hasAuthSecret?: boolean;
    hasAuthRepository?: boolean;
    includesRoles?: boolean;
    includesOAuthTokens?: boolean;
    htmlRedirect: string;
    authProviders: MetaAuthProvider[];
    roleLinks: {
        [index: string]: LinkInfo[];
    };
    serviceRoutes: {
        [index: string]: string[];
    };
    meta: {
        [index: string]: string;
    };
}
export interface AutoQueryConvention {
    name: string;
    value: string;
    types: string;
    valueType: string;
}
export interface AutoQueryInfo {
    maxLimit?: number;
    untypedQueries?: boolean;
    rawSqlFilters?: boolean;
    autoQueryViewer?: boolean;
    async?: boolean;
    orderByPrimaryKey?: boolean;
    crudEvents?: boolean;
    crudEventsServices?: boolean;
    accessRole: string;
    namedConnection: string;
    viewerConventions: AutoQueryConvention[];
    meta: {
        [index: string]: string;
    };
}
export interface ScriptMethodType {
    name: string;
    paramNames: string[];
    paramTypes: string[];
    returnType: string;
}
export interface ValidationInfo {
    hasValidationSource?: boolean;
    hasValidationSourceAdmin?: boolean;
    serviceRoutes: {
        [index: string]: string[];
    };
    typeValidators: ScriptMethodType[];
    propertyValidators: ScriptMethodType[];
    accessRole: string;
    meta: {
        [index: string]: string;
    };
}
export interface SharpPagesInfo {
    apiPath: string;
    scriptAdminRole: string;
    metadataDebugAdminRole: string;
    metadataDebug?: boolean;
    spaFallback?: boolean;
    meta: {
        [index: string]: string;
    };
}
export interface RequestLogsInfo {
    accessRole: string;
    requiredRoles: string[];
    requestLogger: string;
    defaultLimit: number;
    serviceRoutes: {
        [index: string]: string[];
    };
    meta: {
        [index: string]: string;
    };
}
export interface ProfilingInfo {
    accessRole: string;
    defaultLimit: number;
    summaryFields: string[];
    tagLabel: string;
    meta: {
        [index: string]: string;
    };
}
export interface FilesUploadLocation {
    name: string;
    readAccessRole: string;
    writeAccessRole: string;
    allowExtensions: string[];
    allowOperations: string;
    maxFileCount?: number;
    minFileBytes?: number;
    maxFileBytes?: number;
}
export interface FilesUploadInfo {
    basePath: string;
    locations: FilesUploadLocation[];
    meta: {
        [index: string]: string;
    };
}
export interface MetadataTypeName {
    name: string;
    namespace: string;
    genericArgs: string[];
}
export interface MetadataDataContract {
    name: string;
    namespace: string;
}
export interface MetadataDataMember {
    name: string;
    order?: number;
    isRequired?: boolean;
    emitDefaultValue?: boolean;
}
export interface MetadataAttribute {
    name: string;
    constructorArgs: MetadataPropertyType[];
    args: MetadataPropertyType[];
}
export interface RefInfo {
    model: string;
    selfId: string;
    refId: string;
    refLabel: string;
}
export interface MetadataPropertyType {
    name: string;
    type: string;
    namespace?: string;
    isValueType?: boolean;
    isEnum?: boolean;
    isPrimaryKey?: boolean;
    genericArgs?: string[];
    value?: string;
    description?: string;
    dataMember?: MetadataDataMember;
    readOnly?: boolean;
    paramType?: string;
    displayType?: string;
    isRequired?: boolean;
    allowableValues?: string[];
    allowableMin?: number;
    allowableMax?: number;
    attributes?: MetadataAttribute[];
    uploadTo?: string;
    input?: InputInfo;
    format?: FormatInfo;
    ref?: RefInfo;
}
export interface MetadataType {
    name: string;
    namespace?: string;
    genericArgs?: string[];
    inherits?: MetadataTypeName;
    implements?: MetadataTypeName[];
    displayType?: string;
    description?: string;
    notes?: string;
    icon?: ImageInfo;
    isNested?: boolean;
    isEnum?: boolean;
    isEnumInt?: boolean;
    isInterface?: boolean;
    isAbstract?: boolean;
    dataContract?: MetadataDataContract;
    properties?: MetadataPropertyType[];
    attributes?: MetadataAttribute[];
    innerTypes?: MetadataTypeName[];
    enumNames?: string[];
    enumValues?: string[];
    enumMemberValues?: string[];
    enumDescriptions?: string[];
    meta?: {
        [index: string]: string;
    };
}
export interface MediaRule {
    size: string;
    rule: string;
    applyTo: string[];
    meta: {
        [index: string]: string;
    };
}
export interface AdminUsersInfo {
    accessRole: string;
    enabled: string[];
    userAuth: MetadataType;
    allRoles: string[];
    allPermissions: string[];
    queryUserAuthProperties: string[];
    queryMediaRules: MediaRule[];
    formLayout: InputInfo[];
    css: ApiCss;
    meta: {
        [index: string]: string;
    };
}
export interface AdminRedisInfo {
    queryLimit: number;
    databases: number[];
    modifiableConnection?: boolean;
    endpoint: RedisEndpointInfo;
    meta: {
        [index: string]: string;
    };
}
export interface SchemaInfo {
    alias: string;
    name: string;
    tables: string[];
}
export interface DatabaseInfo {
    alias: string;
    name: string;
    schemas: SchemaInfo[];
}
export interface AdminDatabaseInfo {
    queryLimit: number;
    databases: DatabaseInfo[];
    meta: {
        [index: string]: string;
    };
}
export interface PluginInfo {
    loaded: string[];
    auth: AuthInfo;
    autoQuery: AutoQueryInfo;
    validation: ValidationInfo;
    sharpPages: SharpPagesInfo;
    requestLogs: RequestLogsInfo;
    profiling: ProfilingInfo;
    filesUpload: FilesUploadInfo;
    adminUsers: AdminUsersInfo;
    adminRedis: AdminRedisInfo;
    adminDatabase: AdminDatabaseInfo;
    meta: {
        [index: string]: string;
    };
}
export interface CustomPluginInfo {
    accessRole: string;
    serviceRoutes: {
        [index: string]: string[];
    };
    enabled: string[];
    meta: {
        [index: string]: string;
    };
}
export interface MetadataTypesConfig {
    baseUrl: string;
    usePath: string;
    makePartial: boolean;
    makeVirtual: boolean;
    makeInternal: boolean;
    baseClass: string;
    package: string;
    addReturnMarker: boolean;
    addDescriptionAsComments: boolean;
    addDataContractAttributes: boolean;
    addIndexesToDataMembers: boolean;
    addGeneratedCodeAttributes: boolean;
    addImplicitVersion?: number;
    addResponseStatus: boolean;
    addServiceStackTypes: boolean;
    addModelExtensions: boolean;
    addPropertyAccessors: boolean;
    excludeGenericBaseTypes: boolean;
    settersReturnThis: boolean;
    makePropertiesOptional: boolean;
    exportAsTypes: boolean;
    excludeImplementedInterfaces: boolean;
    addDefaultXmlNamespace: string;
    makeDataContractsExtensible: boolean;
    initializeCollections: boolean;
    addNamespaces: string[];
    defaultNamespaces: string[];
    defaultImports: string[];
    includeTypes: string[];
    excludeTypes: string[];
    exportTags: string[];
    treatTypesAsStrings: string[];
    exportValueTypes: boolean;
    globalNamespace: string;
    excludeNamespace: boolean;
    dataClass: string;
    dataClassJson: string;
    ignoreTypes: string[];
    exportTypes: string[];
    exportAttributes: string[];
    ignoreTypesInNamespaces: string[];
}
export interface MetadataRoute {
    path: string;
    verbs: string;
    notes: string;
    summary: string;
}
export interface ApiUiInfo {
    locodeCss: ApiCss;
    explorerCss: ApiCss;
    formLayout: InputInfo[];
    meta: {
        [index: string]: string;
    };
}
export interface MetadataOperationType {
    request: MetadataType;
    response: MetadataType;
    actions: string[];
    returnsVoid?: boolean;
    method: string;
    returnType: MetadataTypeName;
    routes: MetadataRoute[];
    dataModel: MetadataTypeName;
    viewModel: MetadataTypeName;
    requiresAuth?: boolean;
    requiredRoles: string[];
    requiresAnyRole: string[];
    requiredPermissions: string[];
    requiresAnyPermission: string[];
    tags: string[];
    ui: ApiUiInfo;
}
export interface MetadataTypes {
    config: MetadataTypesConfig;
    namespaces: string[];
    types: MetadataType[];
    operations: MetadataOperationType[];
}
export interface Pair {
    key: string,
    value?: any
}

export interface KeyValuePair<TKey, TValue> {
    key: TKey;
    value: TValue;
}
export interface AppMetadata {
    date: string;
    app: AppInfo;
    ui: UiInfo;
    config: ConfigInfo;
    contentTypeFormats: {
        [index: string]: string;
    };
    httpHandlers: {
        [index: string]: string;
    };
    plugins: PluginInfo;
    customPlugins: {
        [index: string]: CustomPluginInfo;
    };
    api: MetadataTypes;
    meta: {
        [index: string]: string;
    };
}

export class MetadataApp implements IReturn<AppMetadata>
{
    public view?: string;
    public includeTypes?: string[];

    public constructor(init?: Partial<MetadataApp>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'MetadataApp'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return {} as AppMetadata }
}
