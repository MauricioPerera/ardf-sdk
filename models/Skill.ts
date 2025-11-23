/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Skill = {
    id?: number;
    name?: string;
    slug?: string;
    description?: string;
    category?: string;
    /**
     * local=ARDF Native (zero cost), worker/proxy=External API
     */
    executor_type?: Skill.executor_type;
    capabilities?: Array<string>;
    pricing_model?: Skill.pricing_model;
    cost_estimate?: string;
    verified?: boolean;
    trust_score?: number;
    requires_credentials?: boolean;
    required_service?: string;
    visibility_type?: Skill.visibility_type;
    docs_url?: string;
    /**
     * Only present in discovery results
     */
    relevance_score?: number;
};
export namespace Skill {
    /**
     * local=ARDF Native (zero cost), worker/proxy=External API
     */
    export enum executor_type {
        LOCAL = 'local',
        WORKER = 'worker',
        PROXY = 'proxy',
    }
    export enum pricing_model {
        FREE = 'free',
        FREEMIUM = 'freemium',
        PAID = 'paid',
        ENTERPRISE = 'enterprise',
    }
    export enum visibility_type {
        PUBLIC = 'public',
        PRIVATE = 'private',
    }
}

