# Local store inventory testing

Store-specific inventory is active on every reservation page. Product-ID allowlists
and the temporary environment flag have been removed.

Open any reservation page without a query string to choose a store. Continuing loads
that store's published category products. The selected store is reflected in the
`?store=siesels-meats` or `?store=iowa-meat-farms` URL. Changing stores returns to
the dialog and clears the form, including selected items and contact details.

Store ownership currently comes from the final product-name suffix:

- ` - Siesel's`
- ` - Iowa Meat Farms` (` - Iowa Meat Farm's` is also accepted for the local hams)

The form removes that suffix from display names. Unsuffixed originals are excluded.
Server-side submission checks verify the selected store's products, category,
publication status, variations and stock. Only published products are orderable;
the draft duplicates on the live WooCommerce site are not changed by this work.

Use the local WordPress database for test orders. These forms create real orders
in whichever WooCommerce instance the local environment points at. Reconcile existing orders into each store’s remaining stock when migrating products.
