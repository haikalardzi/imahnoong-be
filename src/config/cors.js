const corsOptions = {
    origin: '*',                    // Allow all origins (default: '*')
    methods: ['GET', 'PUT', 'POST'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Custom-Header'],
    credentials: true,               // Allow cookies in cross-origin requests
    maxAge: 86400,                   // Cache preflight requests for 24 hours
    preflight: true                  // Enable preflight OPTIONS requests handling
}

export default corsOptions;