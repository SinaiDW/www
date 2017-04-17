

<?php

include_once("db.php");

$sc = getConnector('Sinai Central');

$conn = oci_connect($sc['username'], $sc['password'], $sc['connect_string']);

if (!$conn) {
    $e = oci_error();
    trigger_error($e['message'], E_USER_ERROR);
} 

$stid = oci_parse($conn, "SELECT * FROM hr.user_tab where fname = 'HARRY'");
oci_execute($stid);

echo '<table id="dataTable" class="display dataTable" cellspacing="0" width="100%" role="grid" aria-describedby="example_info" style="width: 100%;">';
echo '<thead><tr><th>First</th><th>Last</th></thead><tbody>';
while ($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS)) {
    echo '<tr role="row">';
    echo "    <td>" . $row["FNAME"] . '</td><td> ' . $row["LNAME"] . "</td>\n";
    echo "</tr>\n";
} 

echo "</tbody></table>\n";


?>



<script>
$(document).ready(function() {
    $('#dataTable').DataTable();
} );

</script>