import { IncomingMessage, ServerResponse } from "http";

declare namespace CAS {
	type protocolVersionNumber = 1 | 2 | 3;
}

declare namespace httpCasClient {
	interface Handler {

		/**
		 * @returns continuity
		 */
		(req: IncomingMessage, res: ServerResponse, hooks: Handler.hooks): Promise<Boolean>;
	}

	namespace Handler {
		interface hooks {

			/**
			 * Define a function to get ticket id from any store.
			 */
			getTicket?: () => String;

			/**
			 * Do something when a new ticket created.
			 */
			ticketCreated?: (ticketId: String) => void;

			/**
			 * Do something when a specific ticket has been destroyed.
			 */
			ticketDestroyed?: (ticketId: String) => void;

			/**
			 * A function return resolved request body object.
			 */
			bodyParser?: () => Object | Promise<Object>;
		}
	}
	
	interface Options {
		/**
		 * The origin of CAS server.
		 */
		origin: String;

		/**
		 * CAS protocol version 1, 2, 3
		 */
		cas?: CAS.protocolVersionNumber;

		/**
		 * If this parameter is set, ticket validation will only succeed if the service ticket was
		 * issued from the presentation of the user’s primary credentials.
		 */
		renew?: Boolean;
		
		/**
		 * If this parameter is set, CAS will not ask the client for credentials. 
		 */
		gateway?: Boolean;
		
		/**
		 * Use SLO or not.
		 */
		slo?: Boolean;

		/**
		 * URLs of requests matched rules will not be affected.
		 */
		filter?: String[];
		
		/**
		 * CAS URIs.
		 */
		path?: Options.path;

		/**
		 * About CAS proxy.
		 */
		proxy?: Options.proxy;
	}

	namespace Options {

		interface path {

			/**
			 * credential requestor / acceptor
			 */
			login?: String;

			/**
			 * destroy CAS session (logout)
			 */
			logout?: String;

			/**
			 * service ticket validation [CAS 1.0]
			 */
			validate?: String;

			/**
			 * service ticket validation [CAS 2.0]
			 */
			serviceValidate?: String;

			/**
			 * service/proxy ticket validation [CAS 2.0]
			 */
			proxyValidate?: String;

			/**
			 * proxy ticket service [CAS 2.0]
			 */
			proxy?: String;

			/**
			 * CAS 3.0 uri
			 */
			p3?: {
				
				/**
				 * service ticket validation [CAS 3.0]
				 */
				serviceValidate?: String;

				/**
				 * service/proxy ticket validation [CAS 3.0]
				 */
				proxyValidate?: String;
			}
		}
				
		interface proxy {

			/**
			 * Handle a PT ticket or not.
			 */
			accepted?: Boolean;

			/**
			 * Enable proxy feature or not. PgtCallbackUrl will be effectived when true.
			 */
			enabled?: Boolean;

			/**
			 * The callback url that receiving pgt and pgtIou from CAS server.
			 */
			pgtCallbackUrl?: String;
		}
	}
}

/**
 * Create a native CasClientHandler for native http.createServer.
 */
declare function httpCasClient(...options: httpCasClient.Options[]): httpCasClient.Handler;

export = httpCasClient;