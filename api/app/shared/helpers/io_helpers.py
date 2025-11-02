import io
import json
import csv


def to_json_stream(data: list[dict]) -> io.BytesIO:
    """
    Convert a dictionary to a JSON memory stream for download or upload.
    """
    if not data:
        raise ValueError("No data provided to convert to JSON.")

    json_str = json.dumps(data, ensure_ascii=False)
    stream = io.BytesIO(json_str.encode("utf-8"))
    stream.seek(0)
    return stream


def to_csv_stream(data: list[dict]) -> io.BytesIO:
    """
    Convert a list of dictionaries to an in-memory CSV file stream.
    Each dictionary represents a row.
    """
    if not data:
        raise ValueError("No data provided to convert to CSV.")

    # Create an in-memory text stream
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=data[0].keys())

    # Write headers and rows
    writer.writeheader()
    writer.writerows(data)

    # Convert to bytes stream for FastAPI
    stream = io.BytesIO(output.getvalue().encode("utf-8"))
    stream.seek(0)
    return stream
