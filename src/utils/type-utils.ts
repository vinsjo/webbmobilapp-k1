/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent } from 'react';

export type PropTypes<
    T extends FunctionComponent<P>,
    P = any
> = Parameters<T>[0];

export type OmitProps<
    T extends FunctionComponent<P>,
    K extends keyof P,
    P = any
> = Omit<PropTypes<T>, K>;

export type PickProps<
    T extends FunctionComponent<P>,
    K extends keyof P,
    P = any
> = Pick<PropTypes<T>, K>;
