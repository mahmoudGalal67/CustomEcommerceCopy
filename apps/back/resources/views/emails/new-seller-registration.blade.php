<!DOCTYPE html>
<html>

<head>
    <title>New Seller Registration</title>
</head>

<body>

    <h2>New Seller Registration</h2>

    <p>
        A new seller has registered and is waiting for approval.
    </p>

    <hr>

    <p>
        <strong>Name:</strong>
        {{ $seller->name }}
    </p>

    <p>
        <strong>Email:</strong>
        {{ $seller->email }}
    </p>

    <p>
        <strong>Store Name:</strong>
        {{ $seller->store_name }}
    </p>

    <p>
        <strong>Status:</strong>
        {{ $seller->status }}
    </p>

    <hr>

    <p>
        Please log in to the admin dashboard to approve or reject this seller.
    </p>

</body>

</html>