import { errorParse } from "@Error/index";
import { Router, RouterOptions } from "express";

export class ExtRouter {
    private _router: Router;

    constructor(options?: RouterOptions | undefined) {
        this._router = Router(options);
    }

    get router() {
        return this._router;
    }

    get(path: string, ...handlers: any[]) {
        const hndls = this.prepareWrapper(handlers);
        this._router.get(path, ...hndls);
        return this;
    }

    post(path: string, ...handlers: any[]) {
        const hndls = this.prepareWrapper(handlers);
        this._router.post(path, ...hndls);
        return this;
    }

    put(path: string, ...handlers: any[]) {
        const hndls = this.prepareWrapper(handlers);
        this._router.put(path, ...hndls);
        return this;
    }

    patch(path: string, ...handlers: any[]) {
        const hndls = this.prepareWrapper(handlers);
        this._router.patch(path, ...hndls);
        return this;
    }

    delete(path: string, ...handlers: any[]) {
        const hndls = this.prepareWrapper(handlers);
        this._router.delete(path, ...hndls);
        return this;
    }

    all(path: string, ...handlers: any[]) {
        const hndls = this.prepareWrapper(handlers);
        this._router.all(path, ...hndls);
        return this;
    }

    use(...args: any[]) {
        this._router.use.apply(this._router, args as any);
        return this;
    }

    private prepareWrapper(handlers: any[]) {
        if (handlers.length === 0)
            throw new Error("Invalid Handler parameters");
        let last = handlers.pop();
        const tmpLast = async (req: any, res: any, next: any) => {
            try {
                last && (await last(req, res));
            } catch (error) {
                errorParse(error as Error, next);
            }
        };
        return [...handlers, tmpLast];
    }
}
