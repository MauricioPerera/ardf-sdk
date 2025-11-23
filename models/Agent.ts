/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Agent = {
    id?: number;
    user_id?: number;
    name?: string;
    description?: string;
    framework?: Agent.framework;
    /**
     * Optional webhook endpoint
     */
    endpoint?: string;
    status?: Agent.status;
    skills_count?: number;
    credentials_count?: number;
    created_at?: string;
    updated_at?: string;
};
export namespace Agent {
    export enum framework {
        CREWAI = 'crewai',
        LANGGRAPH = 'langgraph',
        AUTOGEN = 'autogen',
        LANGCHAIN = 'langchain',
        CUSTOM = 'custom',
    }
    export enum status {
        ACTIVE = 'active',
        INACTIVE = 'inactive',
        ARCHIVED = 'archived',
    }
}

