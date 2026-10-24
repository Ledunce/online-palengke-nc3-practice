Scope: Vue application and local JSON Server API



Asset: Product pricing records.



Risk: Direct API requests can save invalid negative prices.



Evidence: PATCH accepted price -10, and a subsequent GET

confirmed that -10 was stored.



Existing frontend control: Vue rejects negative prices

submitted through the form.



Missing backend control: Server-side enforcement of the

nonnegative-price rule.



Possible impact: Incorrect product prices and unreliable

pricing calculations.



Recommended treatment: Validate supplied prices on create

and update requests. Require a finite number of zero or

greater. Reject invalid requests without changing stored data.



Current status: Open. The test product's price was corrected,

but backend validation has not been implemented.



Bypassing Vue is not automatically a security violation. The API must independently authenticate the caller, authorize the action, and validate the data.

